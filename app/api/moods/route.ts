import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Valid mood values matching Prisma enum
const validMoods = ['VERY_SAD', 'SAD', 'NEUTRAL', 'HAPPY', 'VERY_HAPPY'] as const

// Type guard to validate mood values
function isValidMood(value: unknown): value is typeof validMoods[number] {
  return typeof value === 'string' && validMoods.includes(value as typeof validMoods[number])
}

// GET /api/moods - Fetch all mood entries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') // Optional: limit number of results

    const moodEntries = await prisma.moodEntry.findMany({
      orderBy: {
        createdAt: 'desc', // Most recent first
      },
      take: limit ? parseInt(limit) : undefined, // Limit results if specified
    })

    return NextResponse.json({
      success: true,
      data: moodEntries,
    })
  } catch (error) {
    console.error('Error fetching mood entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mood entries' },
      { status: 500 }
    )
  }
}

// POST /api/moods - Create a new mood entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mood, feelings, journalEntry, sleepHours } = body

    // Validate required fields
    if (!isValidMood(mood)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mood value' },
        { status: 400 }
      )
    }

    if (!feelings || !Array.isArray(feelings)) {
      return NextResponse.json(
        { success: false, error: 'Feelings must be an array' },
        { status: 400 }
      )
    }

    if (!journalEntry) {
      return NextResponse.json(
        { success: false, error: 'Journal entry is required' },
        { status: 400 }
      )
    }

    if (sleepHours === undefined || sleepHours === null) {
      return NextResponse.json(
        { success: false, error: 'Sleep hours is required' },
        { status: 400 }
      )
    }

    // Create mood entry in database
    const moodEntry = await prisma.moodEntry.create({
      data: {
        mood,
        feelings: JSON.stringify(feelings), // Store array as JSON string
        journalEntry,
        sleepHours: parseInt(sleepHours),
        // userId will be null for now (before auth is implemented)
      },
    })

    return NextResponse.json({
      success: true,
      data: moodEntry,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating mood entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create mood entry' },
      { status: 500 }
    )
  }
}
