import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.svg";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 pb-8">
      <Image src={logo} alt="Logo" />
      <span className="text-2xl font-bold text-foreground">Mood Tracker</span>
    </Link>
  );
}
