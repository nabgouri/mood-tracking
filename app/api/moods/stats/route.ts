import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Mood } from "@prisma/client";

// Map mood enum to numeric value for calculations
const moodToNumber: Record<Mood, number> = {
  VERY_SAD: -2,
  SAD: -1,
  NEUTRAL: 0,
  HAPPY: 1,
  VERY_HAPPY: 2,
};

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
        (sum, entry) => sum + moodToNumber[entry.mood],
        0
      );
      averageMood = moodSum / 5;
    }

    // Calculate average sleep
    let averageSleep = null;
    if (last5Moods.length === 5) {
      const sleepSum = last5Moods.reduce(
        (sum, entry) => sum + entry.sleepHours,
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
        hasEnoughSleepData: last5Moods.length >= 5,
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
