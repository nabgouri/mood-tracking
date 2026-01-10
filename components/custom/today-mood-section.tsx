"use client";

import { useState } from "react";
import LogMood from "@/components/custom/log-mood";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// Mood enum type matching Prisma schema
type Mood = "VERY_SAD" | "SAD" | "NEUTRAL" | "HAPPY" | "VERY_HAPPY";

interface MoodEntry {
  mood: Mood;
  feelings: string[];
  journalEntry: string;
  sleepHours: number;
}

interface TodayMoodSectionProps {
  initialMoodEntry?: MoodEntry | null;
}

// Helper to get mood label and icon
function getMoodInfo(mood: Mood): {
  label: string;
  icon: string;
  quote: string;
} {
  const moodMap: Record<Mood, { label: string; icon: string; quote: string }> = {
    VERY_HAPPY: {
      label: "Very Happy",
      icon: "/logMood-icons/very-happy.svg",
      quote: "Your positive energy is contagious; keep shining!",
    },
    HAPPY: {
      label: "Happy",
      icon: "/logMood-icons/Happy.svg",
      quote: "Happiness is not by chance, but by choice.",
    },
    NEUTRAL: {
      label: "Neutral",
      icon: "/logMood-icons/Neutral.svg",
      quote: "Balance is key; take things one step at a time.",
    },
    SAD: {
      label: "Sad",
      icon: "/logMood-icons/Sad.svg",
      quote: "It's okay to feel this way; brighter days are ahead.",
    },
    VERY_SAD: {
      label: "Very Sad",
      icon: "/logMood-icons/very-sad.svg",
      quote: "You are stronger than you think; the storm will pass.",
    },
  };
  return moodMap[mood];
}

// Helper to get sleep hours label
function getSleepHoursLabel(sleepIndex: number): string {
  const sleepLabels = [
    "0-2 hours",
    "3-4 hours",
    "5-6 hours",
    "7-8 hours",
    "9+ hours",
  ];
  return sleepLabels[sleepIndex] || "Unknown";
}

export default function TodayMoodSection({
  initialMoodEntry,
}: TodayMoodSectionProps) {
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(
    initialMoodEntry || null
  );

  const handleMoodSubmit = (moodData: MoodEntry) => {
    setTodayMood(moodData);
  };

  return (
    <>
      <LogMood
        triggerContent="Log today's mood"
        className="self-center"
        onMoodSubmit={handleMoodSubmit}
      />

      {todayMood && (
        <div className="grid grid-cols-2 md:grid-cols-[60%_1fr] gap-x-8 gap-y-5 mb-8 w-full max-w-7xl mx-auto ">
          {/* Mood Card */}
          <Card
            className="col-end-2 col-start-1 row-end-3 row-start-1 p-8 flex flex-col justify-between overflow-hidden"
            style={{
              backgroundImage: `url(${getMoodInfo(todayMood.mood).icon})`,
              backgroundPosition: "right 20px bottom",
              backgroundSize: "320px 320px",
              backgroundRepeat: "no-repeat",
            }}
          >
            <CardHeader className="md:px-0 w-full">
              <CardTitle className="text-[2.5rem] leading-[120%] font-bold flex flex-col">
                <span className="opacity-70 text-[2rem]">I&apos;m feeling</span>{" "}
                {getMoodInfo(todayMood.mood).label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex  flex-col gap-3 md:px-0 w-1/2">
              <Image
                src="/logMood-icons/Quote-Icon.svg"
                alt="Quote"
                width={24}
                height={24}
              />
              <div className="text-foreground text-lg italic font-medium leading-relaxed">
                {getMoodInfo(todayMood.mood).quote}
              </div>
            </CardContent>
          </Card>

          {/* Sleep Card */}
          <Card className="border-border p-5 gap-4">
            <CardHeader className="flex items-center gap-2 md:px-0">
              <CardTitle className="text-lg leading-[140%] font-medium flex items-center gap-2 text-muted-foreground">
                <Image
                  src="/logMood-icons/Sleep-icon.svg"
                  alt="Sleep"
                  width={22}
                  height={22}
                />
                Sleep
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground text-[2rem] font-bold md:px-0">
              {getSleepHoursLabel(todayMood.sleepHours)}
            </CardContent>
          </Card>

          {/* Reflection Card */}
          <Card className="border-border p-5">
            <CardHeader className=" flex items-center gap-2 md:px-0">
              <Image
                src="/logMood-icons/Reflection-Icon.svg"
                alt="Reflection"
                width={22}
                height={22}
              />
              <CardTitle className="text-lg leading-[140%] font-medium flex items-center gap-2 text-muted-foreground">
                Reflection of the day
              </CardTitle>
            </CardHeader>
            <CardContent className=" flex-1 flex flex-col gap-14 md:px-0">
              <p className="text-foreground text-lg leading-[120%] tracking-[-0.02em] font-medium">
                {todayMood.journalEntry}
              </p>
              <div className="flex flex-wrap gap-2">
                {todayMood.feelings.map((feeling) => (
                  <span
                    key={feeling}
                    className="text-muted-foreground text-lg leading-[130%] italic font-medium"
                  >
                    #{feeling}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
