"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

export async function onboardingAction(
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

  // Validate image if provided
  if (profileImageBase64) {
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
    // Update user with name and profile image
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        profileImage: profileImageBase64 || null,
        onboarded: true,
      },
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return "Something went wrong. Please try again.";
  }

  // Redirect to home page after successful onboarding
  redirect("/");
}
