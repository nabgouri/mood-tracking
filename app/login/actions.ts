"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function loginAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  if (!email || !email.includes("@")) {
    return "Invalid email address";
  }

  if (!password) {
    return "Password is required";
  }

  // ==========================================================================
  // FIND USER
  // ==========================================================================

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // ==========================================================================
  // VERIFY PASSWORD
  // Always use generic error message - don't reveal if email exists
  // This prevents email enumeration attacks
  // ==========================================================================

  if (!user) {
    // User not found, but use generic message
    return "Invalid email or password";
  }

  // Compare password with stored hash (timing-safe comparison)
  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return "Invalid email or password";
  }

  // ==========================================================================
  // CREATE SESSION
  // ==========================================================================

  try {
    await createSession(user.id);
  } catch (error) {
    console.error("Login error:", error);
    return "Something went wrong. Please try again.";
  }

  // Redirect based on onboarding status
  if (!user.onboarded) {
    redirect("/onboarding");
  }

  redirect("/");
}
