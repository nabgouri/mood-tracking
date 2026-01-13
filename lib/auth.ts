import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

// =============================================================================
// PASSWORD HASHING
// =============================================================================

// Cost factor for bcrypt (10-12 is recommended)
// Higher = slower but more secure against brute force
// Each increment doubles the time to hash
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * - Automatically generates a random salt
 * - Salt is embedded in the output hash (no need to store separately)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 * - Uses timing-safe comparison (prevents timing attacks)
 * - Extracts salt from stored hash automatically
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

// Session duration: 30 days (in milliseconds)
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

// Cookie name for session token
const SESSION_COOKIE_NAME = "session_token";

/**
 * Create a new session for a user
 * - Stores session in database with expiration
 * - Sets HTTP-only cookie (JavaScript cannot access it - prevents XSS)
 */
export async function createSession(userId: string): Promise<string> {
  // Calculate expiration date
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  // Create session in database
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
  });

  // Set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session.id, {
    httpOnly: true, // JavaScript cannot access (prevents XSS)
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax", // Prevents CSRF for most cases
    expires: expiresAt,
    path: "/", // Cookie available on all routes
  });

  return session.id;
}

/**
 * Validate the current session from cookies
 * - Returns user if session is valid
 * - Returns null if no session or expired
 */
export async function validateSession(): Promise<{
  user: { id: string; email: string; name: string | null; profileImage: string | null; onboarded: boolean };
  sessionId: string;
} | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  // Find session in database with user data
  const session = await prisma.session.findUnique({
    where: { id: sessionToken },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          profileImage: true,
          onboarded: true,
          // Never select passwordHash!
        },
      },
    },
  });

  // Session not found
  if (!session) {
    return null;
  }

  // Session expired - delete it and return null
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: sessionToken } });
    return null;
  }

  return {
    user: session.user,
    sessionId: session.id,
  };
}

/**
 * Delete the current session (logout)
 * - Removes session from database
 * - Clears the cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    // Delete from database (ignore if not found)
    await prisma.session.delete({ where: { id: sessionToken } }).catch(() => {});
  }

  // Clear the cookie
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get the current user from session (convenience function)
 * - Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await validateSession();
  return session?.user ?? null;
}
