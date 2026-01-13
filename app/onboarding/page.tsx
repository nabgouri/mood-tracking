"use client";

import Logo from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { useActionState, useRef, useState } from "react";
import { onboardingAction } from "./actions";
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
import { User } from "lucide-react";

export default function Onboarding() {
  const [error, action, isPending] = useActionState(onboardingAction, null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (250KB max)
    if (file.size > 250 * 1024) {
      alert("Image must be less than 250KB");
      return;
    }

    // Validate file type
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Only PNG or JPEG images are allowed");
      return;
    }

    // Convert to base64 for preview and submission
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex gap-8 md:gap-12 flex-col items-center justify-center flex-1">
      <Logo />
      <Card className="w-full max-w-sm md:max-w-lg py-10">
        <CardHeader>
          <CardTitle className="text-[2rem] font-bold leading-[120%] tracking-[-0.02em]">
            Personalize your experience
          </CardTitle>
          <CardDescription>
            Add your name and a profile picture to make Mood yours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} id="onboarding-form">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ayman Nabgouri"
                  required
                />
              </div>

              {/* Image upload section */}
              <div className="flex items-center gap-4">
                {/* Avatar preview */}
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-base font-medium">Upload Image</span>
                  <span className="text-sm text-muted-foreground">
                    Max 250KB, PNG or JPEG
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    // size="sm"
                    className="w-fit mt-1  py-2 px-4"
                    onClick={handleUploadClick}
                  >
                    Upload
                  </Button>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="profileImage"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {/* Hidden input to send base64 image */}
                <input
                  type="hidden"
                  name="profileImageBase64"
                  value={imagePreview || ""}
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive mt-4">{error}</p>}
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="onboarding-form"
            className="w-full"
            disabled={isPending}
          >
            Start Tracking
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
