import { redirect } from "next/navigation";
import { validateSession } from "./auth";

/**
 * Require authentication for a page/layout
 * Call this in Server Components to protect routes
 * Redirects to login if not authenticated
 * Redirects to onboarding if user hasn't completed onboarding
 */
export async function requireAuth() {
  const session = await validateSession();

  if (!session) {
    redirect("/login");
  }

  // Redirect to onboarding if not completed
  if (!session.user.onboarded) {
    redirect("/onboarding");
  }

  return session;
}

/**
 * Redirect if already authenticated
 * Use this on login/signup pages to redirect logged-in users
 * Respects onboarding status
 */
export async function redirectIfAuthenticated(redirectTo: string = "/") {
  const session = await validateSession();

  if (session) {
    // If not onboarded, go to onboarding instead
    if (!session.user.onboarded) {
      redirect("/onboarding");
    }
    redirect(redirectTo);
  }
}
