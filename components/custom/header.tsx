"use client";

import Logo from "./logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, LogOut, SettingsIcon, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { logout, updateProfile } from "@/lib/actions";
import { useRef, useState } from "react";

interface HeaderProps {
  user: {
    name: string | null;
    email: string;
    profileImage: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nameValue, setNameValue] = useState(user.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle dialog open/close - reset form when opening
  const handleDialogChange = (open: boolean) => {
    if (open) {
      // Reset form state when opening dialog
      setNameValue(user.name || "");
      setImagePreview(null);
      setError(null);
    }
    setDialogOpen(open);
  };

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);

    const result = await updateProfile(null, formData);

    setIsPending(false);

    if (result) {
      // Error returned
      setError(result);
    } else {
      // Success - close dialog
      setDialogOpen(false);
    }
  };

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

  // Display image: preview > current profile image > default avatar
  const displayImage = imagePreview || user.profileImage;

  return (
    <header className="flex justify-between items-center w-full ">
      <Logo />
      <Popover>
        <PopoverTrigger className="flex items-center gap-2.5 cursor-pointer">
          <Avatar>
            {displayImage ? (
              <AvatarImage
                alt="User Image"
                className="bg-primary object-cover"
                src={displayImage}
              />
            ) : (
              <AvatarFallback className="bg-primary">
                <User className="size-5 text-primary-foreground" />
              </AvatarFallback>
            )}
          </Avatar>
          <ChevronDownIcon className="size-4" />
        </PopoverTrigger>
        <PopoverContent
          align="center"
          sideOffset={16}
          className="w-[calc(100vw-32px)] md:w-56 xl me-4 xl:me-34 md:me-8"
        >
          <div className="grid gap-3">
            <div className="space-y-1 pb-3 border-b border-input">
              <h4 className="text-lg font-medium leading-[120%]">
                {user.name || user.email.split("@")[0]}
              </h4>
              <p className="text-[15px] leading-[140%] tracking-[-0.02em] text-muted-foreground">
                {user.email}
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className=" flex items-center gap-2.5  w-full justify-start has-[>svg]:px-0 has-[>svg]:py-0 font-normal"
                >
                  <SettingsIcon className="size-4" />
                  <span className="text-[15px] leading-[140%] tracking-[-0.02em]  px-2 py-1">
                    Settings
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className=" gap-6 py-10 px-5">
                <DialogHeader className="text-start">
                  <DialogTitle className="text-[2rem] font-bold leading-[140%] tracking-[-0.02em]">
                    Update your profile
                  </DialogTitle>
                  <DialogDescription className="text-lg leading-[140%] tracking-[-0.02em] ">
                    Personalize your account with your name and photo.
                  </DialogDescription>
                </DialogHeader>
                <form id="settings-form" action={handleSubmit} className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Avatar preview */}
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border flex-shrink-0 relative">
                      {displayImage ? (
                        <Image
                          src={displayImage}
                          alt="Profile preview"
                          fill
                          className="object-cover"
                          unoptimized={displayImage.startsWith("data:")}
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
                        className="w-fit mt-1 py-2 px-4"
                        onClick={handleUploadClick}
                      >
                        Upload
                      </Button>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
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
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                </form>
                <DialogFooter>
                  <Button
                    type="submit"
                    form="settings-form"
                    className="w-full"
                    disabled={isPending}
                  >
                    {isPending ? "Saving..." : "Save changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start has-[>svg]:px-0 has-[>svg]:py-0"
              >
                <LogOut className="size-4" />
                <span className="text-[15px] leading-[140%] tracking-[-0.02em] font-normal px-2 py-1">
                  Log out
                </span>
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
}
