import { redirectIfAuthenticated } from "@/lib/auth-guard";

export default async function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect to home if already logged in
  await redirectIfAuthenticated();

  return <>{children}</>;
}
