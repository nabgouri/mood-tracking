import Logo from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!signupForm.email) {
      setError("Email is required");
      return false;
    }
    if (!signupForm.password) {
      setError("Password is required");
      return false;
    }
    if (!signupForm.email.includes("@")) {
      setError("Invalid email");
      return false;
    }
    if (signupForm.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(signupForm),
      });
    } catch (error) {
      setError("Failed to sign up");
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSignup}>
            <div className="flex  flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                  type="email"
                  placeholder="name@mail.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                  type="password"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-5">
          <Button type="submit" className="w-full">
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
