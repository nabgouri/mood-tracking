import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.svg";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 ">
      <Image src={logo} alt="Logo" />
      <span className="text-xl font-bold text-foreground">Mood Tracker</span>
    </Link>
  );
}
