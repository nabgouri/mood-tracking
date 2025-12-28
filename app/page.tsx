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
import LogMood from "@/components/custom/log-mood";
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center w-full ">
        <section className="flex flex-col items-center py-12 gap-4">
          <span className="text-primary text-[1.75rem] md:text-[2rem]  font-bold leading-[130%] md:leading-[140%] tracking-[-0.02em]">
            Hello, username!
          </span>
          <h1 className="text-foreground text-[2.875rem] md:text-[3.25rem]  text-center  font-bold leading-[120%] md:leading-[140%] tracking-[-2px]">
            How are you feeling today?
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-[120%]">
            Wednesday, December 24th
          </p>
        </section>
        <LogMood triggerContent="Log today's mood" />
        <div className="grid grid-cols-1 xl :grid-cols-2 gap-8">
          <Card className="py-5 gap-0 w-full">
            <CardHeader className=" gap-0  pb-3">
              <CardTitle className="text-xl leading-[140%] flex items-center gap-2">
                Average Mood
                <span className="text-muted-foreground text-base leading-[140%] tracking-[-0.02em] font-normal">
                  (Last 5 Check-ins)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Item className="bg-border  bg-[url('/logMood-icons/Pattern.png')] bg-contain bg-right  bg-no-repeat py-10">
                <ItemContent>
                  <ItemTitle className="text-2xl leading-[140%]  font-semibold ">
                    Keep Tracking!
                  </ItemTitle>
                  <ItemDescription className="text-[15px] leading-[140%] tracking-[-0.02em]">
                    Log 5 check-ins to see your average mood.
                  </ItemDescription>
                </ItemContent>
              </Item>
            </CardContent>
            <CardHeader className=" gap-0 items-center pb-3 pt-6">
              <CardTitle className="text-xl leading-[140%] flex items-center gap-2 w-full">
                Average Sleep
                <span className="text-muted-foreground text-base leading-[140%] tracking-[-0.02em] font-normal">
                  (Last 5 Nights)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Item className="bg-border  bg-[url('/logMood-icons/Pattern.png')] bg-contain bg-right  bg-no-repeat py-10">
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
        </div>
      </main>

      {/* <h1>Home</h1> */}
    </>
  );
}
