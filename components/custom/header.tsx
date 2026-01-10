import Logo from "./logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, LogOut, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
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

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full ">
      <Logo />
      <Popover>
        <PopoverTrigger className="flex items-center gap-2.5 cursor-pointer">
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
        <PopoverContent
          align="start"
          sideOffset={16}
          className="w-[calc(100vw-32px)] md:w-56 xl me-4 xl:me-34 md:me-8"
        >
          <div className="grid gap-3">
            <div className="space-y-1 pb-3 border-b border-input">
              <h4 className="text-lg font-medium leading-[120%]">User Name</h4>
              <p className="text-[15px] leading-[140%] tracking-[-0.02em] text-muted-foreground">
                user@email.com
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className=" flex items-center gap-2.5  w-full justify-start has-[>svg]:px-0 has-[>svg]:py-0 font-normal"
                >
                  <SettingsIcon className="size-4" />
                  <span className="text-[15px] leading-[140%] tracking-[-0.02em]">
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
                <form className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/avatar.svg"
                      alt="User Image"
                      width={64}
                      height={64}
                      className="object-cover rounded-full bg-primary self-start"
                    />
                    <div>
                      <Label htmlFor="image">Upload Image</Label>
                      <Input
                        id="image"
                        type="file"
                        className="cursor-pointer absolute opacity-0 inset-0"
                      />
                      <span className="text-[15px] block leading-[140%] tracking-[-0.02em] text-muted-foreground pt-1.5 pb-4">
                        Max 250KB, PNG or JPEG
                      </span>
                      <Button
                        variant="outline"
                        className=" py-2 px-4 border-input"
                      >
                        <Label
                          htmlFor="image"
                          className="text-lg font-medium leading-[120%] tracking-normal"
                        >
                          Upload
                        </Label>
                      </Button>
                    </div>
                  </div>
                </form>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              className="w-full justify-start has-[>svg]:px-0 has-[>svg]:py-0 "
            >
              <LogOut className="size-4 " />
              <span className="text-[15px] leading-[140%] tracking-[-0.02em] font-normal">
                Log out
              </span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
}
