import Header from "@/components/custom/header";
import MainCharts from "@/components/custom/main-chatrs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center  ">
        <section className="flex flex-col items-center py-12 gap-4">
          <span className="text-primary text-[1.75rem]  font-bold leading-[130%] tracking-[-0.02em]">
            Hello, username!
          </span>
          <h1 className="text-foreground text-[2.875rem] text-center  font-bold leading-[120%] tracking-[-2px]">
            How are you feeling today?
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-[120%]">
            Wednesday, December 24th
          </p>
        </section>
        <Button>Log today&apos;s mood</Button>
        <Card className="py-5 gap-0">
          <CardHeader className="grid-cols-2 gap-0 items-center pb-3">
            <CardTitle className="text-xl leading-[140%">
              Average Mood
            </CardTitle>
            <CardDescription className="text-base leading-[140%] tracking-[-0.02em]">
              (Last 5 Check-ins)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Item className="bg-border py-10">
              <ItemContent>
                <ItemTitle className="text-2xl leading-[140%]  font-semibold ">
                  Keep Tracking
                </ItemTitle>
                <ItemDescription className="text-[15px] leading-[140%] tracking-[-0.02em]">
                  Log 5 check-ins to see your average mood.
                </ItemDescription>
              </ItemContent>
            </Item>
          </CardContent>
          <CardHeader className="grid-cols-2 gap-0 items-center pb-3 pt-6">
            <CardTitle className="text-xl leading-[140%]">
              Average Sleep
            </CardTitle>
            <CardDescription className="text-base leading-[140%] tracking-[-0.02em]">
              (Last 5 Check-ins)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Item className="bg-border py-10">
              <ItemContent>
                <ItemTitle className="text-2xl leading-[140%]  font-semibold ">
                  Not enough data yet!
                </ItemTitle>
                <ItemDescription className="text-[15px] leading-[140%] tracking-[-0.02em]">
                  Track 5 nights to view average sleep.
                </ItemDescription>
              </ItemContent>
            </Item>
          </CardContent>
        </Card>
        <MainCharts />
      </main>

      {/* <h1>Home</h1> */}
    </>
  );
}
