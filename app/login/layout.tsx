import { redirectIfAuthenticated } from "@/lib/auth-guard";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect to home if already logged in
  await redirectIfAuthenticated();

  return <>{children}</>;
}
