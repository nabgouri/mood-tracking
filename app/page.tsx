import Header from "@/components/custom/header";
import MainCharts from "@/components/custom/main-chatrs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import TodayMoodSection from "@/components/custom/today-mood-section";
import { prisma } from "@/lib/prisma";
import { Mood } from "@prisma/client";
import { requireAuth } from "@/lib/auth-guard";

// Map mood enum to numeric value for calculations
const moodToNumber: Record<Mood, number> = {
  VERY_SAD: -2,
  SAD: -1,
  NEUTRAL: 0,
  HAPPY: 1,
  VERY_HAPPY: 2,
};

// Helper function to get mood label from average numeric value
function getMoodLabel(avgMood: number): string {
  if (avgMood >= 1.5) return "Very Happy";
  if (avgMood >= 0.5) return "Happy";
  if (avgMood >= -0.5) return "Neutral";
  if (avgMood >= -1.5) return "Sad";
  return "Very Sad";
}

// Helper function to get sleep range label
function getSleepLabel(avgSleep: number): string {
  const sleepRanges = [
    "0-2 hours",
    "3-4 hours",
    "5-6 hours",
    "7-8 hours",
    "9+ hours",
  ];
  return sleepRanges[Math.round(avgSleep)] || "Unknown";
}

// Helper function to convert sleep index (0-4) to chart value (0, 2.5, 5, 7.5, 10)
function sleepIndexToChartValue(sleepIndex: number): number {
  const chartValues = [0, 2.5, 5, 7.5, 10];
  return chartValues[sleepIndex] ?? 0;
}

export default async function Home() {
  // Require authentication - redirects to /login if not logged in
  const { user } = await requireAuth();

  const today = new Date();
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
  const month = today.toLocaleDateString("en-US", { month: "long" });
  const day = today.getDate();
  const year = today.getFullYear();

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formattedDate = `${dayOfWeek}, ${month} ${day}${getOrdinalSuffix(
    day
  )}, ${year}`;

  // Query database for stats (filtered by current user)
  const last5Moods = await prisma.moodEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { mood: true, sleepHours: true },
  });

  let averageMood: number | null = null;
  if (last5Moods.length === 5) {
    averageMood =
      last5Moods.reduce(
        (sum: number, entry) => sum + moodToNumber[entry.mood],
        0
      ) / 5;
  }

  let averageSleep: number | null = null;
  if (last5Moods.length === 5) {
    averageSleep =
      last5Moods.reduce((sum: number, entry) => sum + entry.sleepHours, 0) / 5;
  }

  const hasEnoughMoodData = last5Moods.length >= 5;
  const hasEnoughSleepData = last5Moods.length >= 5;

  // Query for today's mood entry
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const todayMoodEntryRaw = await prisma.moodEntry.findFirst({
    where: {
      userId: user.id,
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    select: {
      mood: true,
      sleepHours: true,
      journalEntry: true,
      feelings: true,
    },
  });

  // Parse feelings from JSON string to array
  const todayMoodEntry = todayMoodEntryRaw
    ? {
        mood: todayMoodEntryRaw.mood,
        feelings: JSON.parse(todayMoodEntryRaw.feelings) as string[],
        journalEntry: todayMoodEntryRaw.journalEntry,
        sleepHours: todayMoodEntryRaw.sleepHours,
      }
    : null;

  // Query mood entries for the chart (user's entries, ordered by date ascending)
  const chartEntries = await prisma.moodEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true, sleepHours: true, mood: true },
  });

  // Transform data for the chart
  const chartData = chartEntries.map((entry) => {
    const date = new Date(entry.createdAt);
    const monthName = date.toLocaleDateString("en-US", { month: "long" });
    const dayNum = date.getDate().toString().padStart(2, "0");
    return {
      day: `${monthName} ${dayNum}`,
      hours: sleepIndexToChartValue(entry.sleepHours),
      mood: moodToNumber[entry.mood],
    };
  });

  return (
    <>
      <Header user={{ name: user.name, email: user.email, profileImage: user.profileImage }} />
      <main className="flex-1 flex flex-col   w-full ">
        <section className="flex flex-col items-center py-12 gap-4">
          <span className="text-primary text-[1.75rem] md:text-[2rem]  font-bold leading-[130%] md:leading-[140%] tracking-[-0.02em]">
            Hello, {user.name || user.email.split("@")[0]}!
          </span>
          <h1 className="text-foreground text-[2.875rem] md:text-[3.25rem]  text-center  font-bold leading-[120%] md:leading-[140%] tracking-[-2px]">
            How are you feeling today?
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-[120%]">
            {formattedDate}
          </p>
        </section>
        <TodayMoodSection initialMoodEntry={todayMoodEntry} />
        <div className="grid grid-cols-1 xl:grid-cols-[40%_60%] gap-8">
          <Card className="py-5 gap-0 w-full">
            <CardHeader className=" gap-0  pb-3">
              <CardTitle className="text-xl leading-[140%] flex items-center gap-2">
                Average Mood
                <span className="text-muted-foreground text-base leading-[140%] tracking-[-0.02em] font-normal">
                  (Last 5 Check-ins)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Item
                className={
                  hasEnoughMoodData && averageMood !== null
                    ? "bg-primary/10"
                    : "bg-border  bg-[url('/logMood-icons/Pattern.png')] bg-contain bg-right  bg-no-repeat py-10"
                }
              >
                <ItemContent>
                  <ItemTitle className="text-2xl leading-[140%]  font-semibold ">
                    {hasEnoughMoodData && averageMood !== null
                      ? getMoodLabel(averageMood)
                      : "Keep Tracking!"}
                  </ItemTitle>
                  <ItemDescription className="text-[15px] leading-[140%] tracking-[-0.02em]">
                    {hasEnoughMoodData && averageMood !== null
                      ? `Average: ${averageMood.toFixed(1)} out of 2.0`
                      : "Log 5 check-ins to see your average mood."}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </CardContent>
            <CardHeader className=" gap-0 items-center pb-3 pt-6">
              <CardTitle className="text-xl leading-[140%] flex items-center gap-2 w-full">
                Average Sleep
                <span className="text-muted-foreground text-base leading-[140%] tracking-[-0.02em] font-normal">
                  (Last 5 Nights)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Item
                className={
                  hasEnoughSleepData && averageSleep !== null
                    ? "bg-primary/10"
                    : "bg-border  bg-[url('/logMood-icons/Pattern.png')] bg-contain bg-right  bg-no-repeat py-10"
                }
              >
                <ItemContent>
                  <ItemTitle className="text-2xl leading-[140%]  font-semibold ">
                    {hasEnoughSleepData && averageSleep !== null
                      ? getSleepLabel(averageSleep)
                      : "Not enough data yet!"}
                  </ItemTitle>
                  <ItemDescription className="text-[15px] leading-[140%] tracking-[-0.02em]">
                    {hasEnoughSleepData && averageSleep !== null
                      ? `Average: ${averageSleep.toFixed(1)} hours per night`
                      : "Track 5 nights to view average sleep."}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </CardContent>
          </Card>
          <MainCharts data={chartData} />
        </div>
      </main>
    </>
  );
}
