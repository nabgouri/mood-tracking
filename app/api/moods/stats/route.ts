import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/moods/stats - Get mood and sleep statistics
export async function GET() {
  try {
    // Fetch last 5 mood entries
    const last5Moods = await prisma.moodEntry.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        mood: true,
        sleepHours: true,
      },
    });

    // Calculate average mood
    let averageMood = null;
    if (last5Moods.length === 5) {
      const moodSum = last5Moods.reduce(
        (sum: number, entry: { mood: number }) => sum + entry.mood,
        0
      );
      averageMood = moodSum / 5;
    }

    // Calculate average sleep
    let averageSleep = null;
    const sleepEntries = last5Moods.filter(
      (entry: { mood: number; sleepHours: number | null }): entry is typeof entry & { sleepHours: number } =>
        entry.sleepHours !== null
    );
    if (sleepEntries.length === 5) {
      const sleepSum = sleepEntries.reduce(
        (sum: number, entry: { mood: number; sleepHours: number }) => sum + entry.sleepHours,
        0
      );
      averageSleep = sleepSum / 5;
    }

    // Get total count of mood entries
    const totalEntries = await prisma.moodEntry.count();

    return NextResponse.json({
      success: true,
      data: {
        averageMood,
        averageSleep,
        totalEntries,
        hasEnoughMoodData: last5Moods.length >= 5,
        hasEnoughSleepData: sleepEntries.length >= 5,
      },
    });
  } catch (error) {
    console.error("Error fetching mood stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mood statistics" },
      { status: 500 }
    );
  }
}
