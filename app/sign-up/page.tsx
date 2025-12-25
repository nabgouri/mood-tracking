"use client";
import Logo from "@/components/custom/logo";

import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignUp() {
  const [error, action, isPending] = useActionState(signupAction, null);

  // const validateForm = () => {
  //   if (!signupForm.email) {
  //     setError("Email is required");
  //     return false;
  //   }
  //   if (!signupForm.password) {
  //     setError("Password is required");
  //     return false;
  //   }
  //   if (!signupForm.email.includes("@")) {
  //     setError("Invalid email");
  //     return false;
  //   }
  //   if (signupForm.password.length < 8) {
  //     setError("Password must be at least 8 characters long");
  //     return false;
  //   }
  //   return true;
  // };

  return (
    <>
      <Logo />
      <Card className="w-full max-w-sm md:max-w-lg py-10">
        <CardHeader>
          <CardTitle className="text-[2rem] font-bold leading-[120%] tracking-[-0.02em]">
            Create an account
          </CardTitle>
          <CardDescription>
            Join to track your daily mood and sleep with ease.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="flex  flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@mail.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-5">
          <Button type="submit" className="w-full" disabled={isPending}>
            Sign up
          </Button>
          <p className="text-lg text-muted-foreground">
            Already got an account?{" "}
            <Link href="/login" className="text-primary">
              Log in.
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
