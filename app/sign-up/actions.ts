"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export async function signupAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // ==========================================================================
  // VALIDATION
  // Server-side validation is critical - never trust client input
  // ==========================================================================

  if (!email || !email.includes("@")) {
    return "Invalid email address";
  }

  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  // ==========================================================================
  // CHECK IF USER EXISTS
  // Use generic error message to prevent email enumeration attacks
  // ==========================================================================

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    // Don't reveal that the email exists (security best practice)
    // An attacker could use this to find valid emails
    return "Unable to create account. Please try again.";
  }

  // ==========================================================================
  // CREATE USER
  // Hash password before storing (NEVER store plain text passwords)
  // ==========================================================================

  try {
    // Hash the password (bcrypt automatically generates salt)
    const passwordHash = await hashPassword(password);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(), // Normalize email
        passwordHash,
      },
    });

    // ==========================================================================
    // CREATE SESSION
    // Log user in immediately after signup
    // ==========================================================================

    await createSession(user.id);

    // Redirect to home page after successful signup
    // Note: redirect() throws an error internally, so this must be outside try-catch
  } catch (error) {
    console.error("Signup error:", error);
    return "Something went wrong. Please try again.";
  }

  // Redirect to onboarding after successful signup (outside try-catch because redirect throws)
  redirect("/onboarding");
}
