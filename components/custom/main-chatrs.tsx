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
    <ChartContainer
      config={{}}
      className="w-full h-[200px] bg-card rounded-2xl border border-border mt-8"
    >
      <h2 className="text-lg font-medium leading-[140%] tracking-[-0.02em]">
        Mood and Sleep Trends
      </h2>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" />
        <YAxis width="auto" />
        <Bar dataKey="hours" fill="#8884d8" />
      </BarChart>
    </ChartContainer>
  );
}
