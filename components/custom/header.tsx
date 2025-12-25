import Logo from "./logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full ">
      <Logo />
      <Popover>
        <PopoverTrigger className="flex items-center gap-2.5">
          <Avatar>
            <AvatarImage
              alt="User Image"
              className="bg-primary"
              src="/avatar.svg"
            />
            <AvatarFallback>User Image</AvatarFallback>
          </Avatar>
          <ChevronDownIcon className="size-4" />
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={16}>
          <div className="grid gap-3  ">
            <div className="space-y-1 pb-3 border-b border-input">
              <h4 className="text-lg font-medium leading-[120%]">User Name</h4>
              <p className="text-[15px] leading-[140%] tracking-[-0.02em] text-muted-foreground">
                user@email.com
              </p>
            </div>
            <div className="grid gap-3">
              <AlertDialog>
                <AlertDialogTrigger className="flex items-center gap-2.5 ">
                  <SettingsIcon className="size-4" />
                  <span className="text-[15px] leading-[140%] tracking-[-0.02em]">
                    Settings
                  </span>
                </AlertDialogTrigger>
                <AlertDialogContent className="text-start">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Update your profile</AlertDialogTitle>
                    <AlertDialogDescription>
                      Personalize your account with your name and photo.
                    </AlertDialogDescription>
                    <form className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" />
                      </div>
                      <div className="grid gap-2"></div>
                    </form>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction asChild>
                      <Button type="submit">Save changes</Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
}
