"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer } from "../ui/chart";
export default function MainCharts() {
  const data: { day: string; hours: number }[] = [
    { day: "April 1st", hours: 0 },
    { day: "April 2nd", hours: 0 },
    { day: "April 3rd", hours: 0 },
    { day: "April 4th", hours: 0 },
    { day: "April 5th", hours: 0 },
    { day: "April 6th", hours: 0 },
    { day: "April 7th", hours: 0 },
    { day: "April 8th", hours: 0 },
    { day: "April 9th", hours: 0 },
    { day: "April 10th", hours: 0 },
    { day: "April 11th", hours: 0 },
  ];
  return (
    <div className="w-full bg-card rounded-2xl border border-border mt-8 xl:mt-0 py-5 px-4 md:px-5 xl:px-8 md:py-8  grid gap-5">
      <h2 className="text-[1.75rem] md:text-[2rem] md:leading-[140%] font-medium leading-[130%] tracking-[-0.02em]">
        Mood and Sleep Trends
      </h2>
      <div className="w-full overflow-x-auto">
        <ChartContainer config={{}} className="h-[400px] min-w-[600px]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis width="auto" dataKey="hours" unit="hours" />
            <Bar dataKey="hours" fill="#8884d8" />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
