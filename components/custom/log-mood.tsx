"use client";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
export default function LogMood({
  triggerContent,
}: {
  triggerContent: string;
}) {
  const [moodData, setMoodData] = useState<{
    mood: -2 | -1 | 0 | 1 | 2;
    feelings: string[];
    journalEntry: string;
    sleepHours: number;
    createdAt: string;
  }>({
    mood: 2,
    feelings: [],
    journalEntry: "",
    sleepHours: 0,
    createdAt: new Date().toISOString(),
  });
  const [moodStep, setMoodStep] = useState<1 | 2 | 3 | 4>(1);
  const handleMoodStep = (step: 1 | 2 | 3 | 4) => {
    setMoodStep(step);
  };
  const formQuestions = [
    "How was your mood today?",
    "How did you feel?",
    "Write about your day...",
    "How many hours did you sleep last night?",
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-16">{triggerContent}</Button>
      </DialogTrigger>
      <DialogContent className="bg-linear-to-b from-[#f5f5ff] overflow-y-auto max-h-[80vh] from-73% gap-6 md:gap-8 to-[#e0e0ff] px-5 md:px-10 py-8 md:py-12">
        <DialogHeader>
          <DialogTitle className="text-[2rem] md:text-[2.5rem] text-start font-bold leading-[140%] tracking-[-0.02em]">
            Log your mood
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <div
            className={`rounded-full  h-1.5 flex-1 ${
              moodStep >= 1 ? "bg-primary" : "bg-muted-foreground"
            }`}
          ></div>
          <div
            className={`rounded-full  h-1.5 flex-1 ${
              moodStep >= 2 ? "bg-primary" : "bg-muted-foreground"
            }`}
          ></div>
          <div
            className={`rounded-full  h-1.5 flex-1 ${
              moodStep >= 3 ? "bg-primary" : "bg-muted-foreground"
            }`}
          ></div>
          <div
            className={`rounded-full  h-1.5 flex-1 ${
              moodStep >= 4 ? "bg-primary" : "bg-muted-foreground"
            }`}
          ></div>
        </div>
        <h3 className="text-[1.75rem] md:text-[2rem] font-bold leading-[130%] md:leading-[140%] tracking-[-0.02em]">
          {formQuestions[moodStep - 1]}
        </h3>
        {moodStep === 1 && (
          <MoodStepOne
            mood={moodData.mood}
            setMood={(newMood) => setMoodData({ ...moodData, mood: newMood })}
          />
        )}
        {moodStep === 2 && (
          <MoodStepTwo
            feelings={moodData.feelings}
            setFeelings={(newFeelings) =>
              setMoodData({ ...moodData, feelings: newFeelings })
            }
          />
        )}
        {moodStep === 3 && (
          <MoodStepThree
            journalEntry={moodData.journalEntry}
            setJournalEntry={(newJournalEntry) =>
              setMoodData({ ...moodData, journalEntry: newJournalEntry })
            }
          />
        )}
        {moodStep === 4 && (
          <MoodStepFour
            sleepHours={moodData.sleepHours}
            setSleepHours={(newSleepHours) =>
              setMoodData({ ...moodData, sleepHours: newSleepHours })
            }
          />
        )}
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={() => handleMoodStep((moodStep + 1) as 1 | 2 | 3 | 4)}
          >
            {moodStep === 4 ? "Submit" : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function MoodStepOne({
  mood,
  setMood,
}: {
  mood: -2 | -1 | 0 | 1 | 2;
  setMood: (mood: -2 | -1 | 0 | 1 | 2) => void;
}) {
  return (
    <RadioGroup
      value={mood.toString()}
      onValueChange={(value) => setMood(parseInt(value) as -2 | -1 | 0 | 1 | 2)}
    >
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-5 py-3">
        <div className="flex items-center gap-3 ">
          <RadioGroupItem value="2" id="1-a" />
          <Label className="text-xl leading-[140%] font-semibold" htmlFor="1-a">
            Very Happy
          </Label>
        </div>
        <Image
          src="/logMood-icons/very-happy.svg"
          alt="Very Happy"
          width={38}
          height={38}
        />
      </div>
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-5 py-3">
        <div className="flex items-center gap-3 ">
          <RadioGroupItem value="1" id="2-a" />
          <Label className="text-xl leading-[140%] font-semibold" htmlFor="2-a">
            Happy
          </Label>
        </div>
        <Image
          src="/logMood-icons/Happy.svg"
          alt="Happy"
          width={38}
          height={38}
        />
      </div>
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-5 py-3">
        <div className="flex items-center gap-3 ">
          <RadioGroupItem value="0" id="3-a" />
          <Label className="text-xl leading-[140%] font-semibold" htmlFor="3-a">
            Neutral
          </Label>
        </div>
        <Image
          src="/logMood-icons/Neutral.svg"
          alt="Neutral"
          width={38}
          height={38}
        />
      </div>
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-5 py-3">
        <div className="flex items-center gap-3 ">
          <RadioGroupItem value="-1" id="4-a" />
          <Label className="text-xl leading-[140%] font-semibold" htmlFor="4-a">
            Sad
          </Label>
        </div>
        <Image src="/logMood-icons/Sad.svg" alt="Sad" width={38} height={38} />
      </div>
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-5 py-3">
        <div className="flex items-center gap-3 ">
          <RadioGroupItem value="-2" id="5-a" />
          <Label className="text-xl leading-[140%] font-semibold" htmlFor="5-a">
            Very Sad
          </Label>
        </div>
        <Image
          src="/logMood-icons/very-sad.svg"
          alt="Very Sad"
          width={38}
          height={38}
        />
      </div>
    </RadioGroup>
  );
}

function MoodStepTwo({
  feelings,
  setFeelings,
}: {
  feelings: string[];
  setFeelings: (feelings: string[]) => void;
}) {
  const feelingsOptions = [
    "Joyful",
    "Down",
    "Anxious",
    "Calm",
    "Excited",
    "Frustrated",
    "Lonely",
    "Gratful",
    "Overwhelmed",
    "Motivated",
    "Irritable",
    "Peaceful",
    "Tired",
    "Hopeful",
    "Confident",
    "Stressed",
    "Content",
    "Disappointed",
    "Optimistic",
    "Restless",
  ];
  return (
    <div className="flex flex-wrap gap-3">
      {feelingsOptions.map((feelingOption, index) => {
        return (
          <div
            key={index}
            className="flex items-center gap-3 bg-card border-2 border-border focus-within:border-primary rounded-lg px-3 py-4"
          >
            <Checkbox id={feelingOption} />
            <Label
              className="text-xl leading-[140%] font-semibold"
              htmlFor={feelingOption}
            >
              {feelingOption}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
function MoodStepThree({
  journalEntry,
  setJournalEntry,
}: {
  journalEntry: string;
  setJournalEntry: (journalEntry: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={journalEntry}
        onChange={(e) => {
          if (e.target.value.length <= 150) {
            setJournalEntry(e.target.value);
          }
        }}
        placeholder="Today, I felt..."
        className="h-32"
      />
      <div className="self-end">{journalEntry.length} / 150</div>
    </div>
  );
}

function MoodStepFour({
  sleepHours,
  setSleepHours,
}: {
  sleepHours: number;
  setSleepHours: (sleepHours: number) => void;
}) {
  const sleepHoursOptions = [
    "9+ hours",
    "7-8 hours",
    "5-6 hours",
    "3-4 hours",
    "0-2 hours",
  ];
  return (
    <RadioGroup
      value={sleepHours.toString()}
      onValueChange={(value) => setSleepHours(parseInt(value))}
    >
      {sleepHoursOptions.map((sleepHoursOption, index) => {
        return (
          <div
            key={index}
            className="flex items-center justify-between bg-card border-2 border-border rounded-lg px-5 py-3 focus-within:border-primary"
          >
            <div className="flex items-center gap-3 ">
              <RadioGroupItem value={index.toString()} id={sleepHoursOption} />
              <Label
                className="text-xl leading-[140%] font-semibold"
                htmlFor={sleepHoursOption}
              >
                {sleepHoursOption}
              </Label>
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
}
