"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer } from "../ui/chart";

// Helper function to get color based on mood
function getMoodColor(mood: number): string {
  const colorMap: Record<number, string> = {
    2: "#FFA726", // Very Happy - Orange
    1: "#66BB6A", // Happy - Green
    0: "#42A5F5", // Neutral - Blue
    [-1]: "#EF5350", // Sad - Red
    [-2]: "#AB47BC", // Very Sad - Purple
  };
  return colorMap[mood] || "#8884d8";
}

// Helper function to get small icon path based on mood
function getMoodIconPath(mood: number): string {
  const iconMap: Record<number, string> = {
    2: "/small-logMood/Very Happy.svg",
    1: "/small-logMood/Happy.svg",
    0: "/small-logMood/Neutral.svg",
    [-1]: "/small-logMood/Sad.svg",
    [-2]: "/small-logMood/Very Sad.svg",
  };
  return iconMap[mood] || "/small-logMood/Neutral.svg";
}

// Custom tick component for Y-axis with Sleep icon
interface CustomYAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

const CustomYAxisTick = ({ x = 0, y = 0, payload }: CustomYAxisTickProps) => {
  // Format the numeric value to hour ranges inside the custom component
  const formatLabel = (value: string | number) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (numValue === 0) return "0-2 hours";
    if (numValue === 2.5) return "3-4 hours";
    if (numValue === 5) return "5-6 hours";
    if (numValue === 7.5) return "7-8 hours";
    if (numValue === 10) return "9+ hours";
    return "";
  };

  const label = formatLabel(payload?.value || 0);

  return (
    <g transform={`translate(${x},${y})`}>
      <image
        href="/logMood-icons/Sleep icon.png"
        x={-95}
        y={-8}
        width={16}
        height={16}
      />
      <text
        x={-75}
        y={4}
        textAnchor="start"
        fontSize="14"
        fill="hsl(var(--muted-foreground))"
      >
        {label}
      </text>
    </g>
  );
};

// Custom tick component for X-axis with date formatting
interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

const CustomXAxisTick = ({ x = 0, y = 0, payload }: CustomXAxisTickProps) => {
  // Split "April 06" into ["April", "06"]
  const parts = payload?.value?.split(" ") || [];
  const month = parts[0] || "";
  const day = parts[1] || "";

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={10}
        textAnchor="middle"
        fontSize="12"
        fill="hsl(var(--muted-foreground))"
      >
        {month}
      </text>
      <text
        x={0}
        y={26}
        textAnchor="middle"
        fontSize="14"
        fontWeight="500"
        fill="hsl(var(--foreground))"
      >
        {day}
      </text>
    </g>
  );
};

// Custom bar shape with rounded corners and mood icon
interface CustomBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: {
    mood: number;
  };
}

const CustomBarShape = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
}: CustomBarShapeProps) => {
  if (!payload) return null;

  const mood = payload.mood;
  const color = getMoodColor(mood);
  const iconPath = getMoodIconPath(mood);
  const radius = 20; // Rounded corner radius
  const iconSize = 24; // Icon size

  return (
    <g>
      {/* Rounded bar */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        rx={radius}
        ry={radius}
      />
      {/* Mood icon at top of bar */}
      <image
        href={iconPath}
        x={x + width / 2 - iconSize / 2}
        y={y - iconSize - 4}
        width={iconSize}
        height={iconSize}
      />
    </g>
  );
};

export default function MainCharts({
  data,
}: {
  data: { day: string; hours: number; mood: number }[];
}) {
  return (
    <div className="w-full bg-card rounded-2xl border border-border mt-8 xl:mt-0 py-5 px-4 md:px-5 xl:px-8 md:py-8  grid gap-5">
      <h2 className="text-[1.75rem] md:text-[2rem] md:leading-[140%] font-medium leading-[130%] tracking-[-0.02em]">
        Mood and Sleep Trends
      </h2>
      {data.length > 0 && (
        <div className="w-full overflow-x-auto">
          <ChartContainer config={{}} className="min-h-[400px]">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={<CustomXAxisTick />} height={60} />
              <YAxis
                width={120}
                tick={<CustomYAxisTick />}
                domain={[0, 10]}
                ticks={[0, 2.5, 5, 7.5, 10]}
              />
              <Bar dataKey="hours" shape={<CustomBarShape />} />
            </BarChart>
          </ChartContainer>
        </div>
      )}
      {data.length === 0 && (
        <p className="text-muted-foreground text-[15px] font-medium leading-[120%] text-center">
          No enough data yet! , please add at least one entry.
        </p>
      )}
    </div>
  );
}
