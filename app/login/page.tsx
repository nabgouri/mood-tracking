"use client";
import Logo from "@/components/custom/logo";

import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { loginAction } from "./actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login() {
  const [error, action, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex gap-8 md:gap-12 flex-col items-center justify-center flex-1">
      <Logo />
      <Card className="w-full max-w-sm md:max-w-lg py-10">
        <CardHeader>
          <CardTitle className="text-[2rem] font-bold leading-[120%] tracking-[-0.02em]">
            Welcome back!
          </CardTitle>
          <CardDescription>
            Log in to continue tracking your mood and sleep.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} id="login-form">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@mail.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive mt-4">{error}</p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-5">
          <Button
            type="submit"
            form="login-form"
            className="w-full"
            disabled={isPending}
          >
            Log In
          </Button>
          <p className="text-lg text-muted-foreground">
            Haven&apos;t got an account?{" "}
            <Link href="/sign-up" className="text-primary">
              Sign up.
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
