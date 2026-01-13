import { redirect } from "next/navigation";
import { validateSession } from "@/lib/auth";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateSession();

  // Must be logged in to access onboarding
  if (!session) {
    redirect("/login");
  }

  // If already onboarded, redirect to home
  if (session.user.onboarded) {
    redirect("/");
  }

  return <>{children}</>;
}
