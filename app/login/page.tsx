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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
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
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="size-5 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="center"
                        className="max-w-md bg-white text-foreground rounded-xl p-4 shadow-lg border border-border [&>svg]:hidden"
                      >
                        <p className="font-semibold flex items-center gap-1.5 mb-2">
                          <InfoIcon className="size-4 text-primary" />
                          Demo Access
                        </p>
                        <p className="text-sm text-muted-foreground mb-2 w-full">
                          You can sign up using a fake email, as long as it&apos;s in a
                          valid format. I recommend signing up, so you can
                          experience the full onboarding process.
                        </p>
                        <p className="text-sm text-muted-foreground mb-3 border-t-2 border-border pt-3">
                          Alternatively, you can log in to an existing demo
                          account using these credentials.
                        </p>
                        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm">
                          <div className="flex gap-4">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">ayman@nabgouri.com</span>
                          </div>
                          <div className="flex gap-4">
                            <span className="text-muted-foreground">Password:</span>
                            <span className="font-medium">Ayman1234</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
