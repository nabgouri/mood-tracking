"use server";

import { deleteSession, validateSession } from "./auth";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function logout() {
  await deleteSession();
  redirect("/login");
}

// Valid mood values matching Prisma enum
const validMoods = ["VERY_SAD", "SAD", "NEUTRAL", "HAPPY", "VERY_HAPPY"] as const;
type Mood = (typeof validMoods)[number];

// Type guard to validate mood values
function isValidMood(value: unknown): value is Mood {
  return (
    typeof value === "string" && validMoods.includes(value as Mood)
  );
}

export async function createMoodEntry(data: {
  mood: string;
  feelings: string[];
  journalEntry: string;
  sleepHours: number;
}): Promise<{ success: boolean; error?: string }> {
  // Verify user is authenticated
  const session = await validateSession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const { mood, feelings, journalEntry, sleepHours } = data;

  // Validate mood
  if (!isValidMood(mood)) {
    return { success: false, error: "Invalid mood value" };
  }

  // Validate feelings
  if (!feelings || !Array.isArray(feelings) || feelings.length === 0) {
    return { success: false, error: "At least one feeling is required" };
  }

  if (feelings.length > 3) {
    return { success: false, error: "Maximum 3 feelings allowed" };
  }

  // Validate journal entry
  if (!journalEntry || journalEntry.trim().length === 0) {
    return { success: false, error: "Journal entry is required" };
  }

  // Validate sleep hours
  if (sleepHours === undefined || sleepHours === null) {
    return { success: false, error: "Sleep hours is required" };
  }

  try {
    await prisma.moodEntry.create({
      data: {
        mood,
        feelings: JSON.stringify(feelings),
        journalEntry: journalEntry.trim(),
        sleepHours,
        userId: session.user.id,
      },
    });

    // Revalidate home page to show updated chart data
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error creating mood entry:", error);
    return { success: false, error: "Failed to save mood entry" };
  }
}

export async function updateProfile(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  // Verify user is authenticated
  const session = await validateSession();
  if (!session) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const profileImageBase64 = formData.get("profileImageBase64") as string;

  // Validation
  if (!name || name.trim().length === 0) {
    return "Name is required";
  }

  if (name.trim().length > 100) {
    return "Name must be less than 100 characters";
  }

  // Validate image if provided (non-empty string means new image)
  if (profileImageBase64 && profileImageBase64.length > 0) {
    // Check if it's a valid base64 image
    if (!profileImageBase64.startsWith("data:image/")) {
      return "Invalid image format";
    }

    // Check size (base64 is ~33% larger than original, so 250KB * 1.33 ≈ 333KB)
    if (profileImageBase64.length > 350 * 1024) {
      return "Image must be less than 250KB";
    }
  }

  try {
    // Build update data
    const updateData: { name: string; profileImage?: string | null } = {
      name: name.trim(),
    };

    // Only update image if a new one was provided
    if (profileImageBase64 && profileImageBase64.length > 0) {
      updateData.profileImage = profileImageBase64;
    }

    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Revalidate the page to show updated data
    revalidatePath("/");

    return null; // Success
  } catch (error) {
    console.error("Update profile error:", error);
    return "Something went wrong. Please try again.";
  }
}
