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

// Mood enum type matching Prisma schema
type Mood = "VERY_SAD" | "SAD" | "NEUTRAL" | "HAPPY" | "VERY_HAPPY";

// Type guard to validate mood values
function isMood(value: string): value is Mood {
  return ["VERY_SAD", "SAD", "NEUTRAL", "HAPPY", "VERY_HAPPY"].includes(value);
}

export default function LogMood({
  triggerContent,
  className,
  onMoodSubmit,
}: {
  triggerContent: string;
  className?: string;
  onMoodSubmit?: (moodData: {
    mood: Mood;
    feelings: string[];
    journalEntry: string;
    sleepHours: number;
  }) => void;
}) {
  const [moodData, setMoodData] = useState<{
    mood: Mood | null;
    feelings: string[];
    journalEntry: string;
    sleepHours: number | null;
    createdAt: string;
  }>({
    mood: null,
    feelings: [],
    journalEntry: "",
    sleepHours: null,
    createdAt: new Date().toISOString(),
  });
  const [moodStep, setMoodStep] = useState<1 | 2 | 3 | 4>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleMoodStep = (step: 1 | 2 | 3 | 4) => {
    setMoodStep(step);
  };
  const formQuestions = [
    "How was your mood today?",
    "How did you feel?",
    "Write about your day...",
    "How many hours did you sleep last night?",
  ];

  const handleProceed = async () => {
    // Validation for step 1
    if (moodStep === 1) {
      if (moodData.mood === null) {
        setErrorMessage("Please select a mood before continuing.");
        return;
      }
      setErrorMessage(null);
      handleMoodStep(2);
    }
    // Validation for step 2
    else if (moodStep === 2) {
      if (moodData.feelings.length === 0) {
        setErrorMessage("Please select at least one tag");
        return;
      }
      if (moodData.feelings.length > 3) {
        setErrorMessage("You can only select a maximum of 3 tags.");
        return;
      }
      setErrorMessage(null);
      handleMoodStep(3);
    }
    // Validation for step 3
    else if (moodStep === 3) {
      if (moodData.journalEntry.length === 0) {
        setErrorMessage(
          "Please write a few words about your day before continuing."
        );
        return;
      }
      setErrorMessage(null);
      handleMoodStep(4);
    }
    // Submit data on step 4
    else if (moodStep === 4) {
      if (moodData.sleepHours === null) {
        setErrorMessage("Please select how many hours you slept");
        return;
      }

      setErrorMessage(null);
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/moods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mood: moodData.mood,
            feelings: moodData.feelings,
            journalEntry: moodData.journalEntry,
            sleepHours: moodData.sleepHours,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to save mood entry');
        }

        // Success! Call callback with the submitted data
        if (onMoodSubmit && moodData.mood !== null && moodData.sleepHours !== null) {
          onMoodSubmit({
            mood: moodData.mood,
            feelings: moodData.feelings,
            journalEntry: moodData.journalEntry,
            sleepHours: moodData.sleepHours,
          });
        }

        // Reset form and close dialog
        setMoodData({
          mood: null,
          feelings: [],
          journalEntry: "",
          sleepHours: null,
          createdAt: new Date().toISOString(),
        });
        setMoodStep(1);
        setIsOpen(false);
      } catch (error) {
        console.error('Error saving mood:', error);
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to save mood entry. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`mb-16 ${className} cursor-pointer`}>
          {triggerContent}
        </Button>
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
            setErrorMessage={setErrorMessage}
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

        <DialogFooter className="flex md:flex-col gap-2">
          {errorMessage && (
            <span className="text-destructive text-base ">{errorMessage}</span>
          )}
          <Button
            type="submit"
            className="w-full"
            onClick={handleProceed}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : moodStep === 4 ? "Submit" : "Continue"}
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
  mood: Mood | null;
  setMood: (mood: Mood | null) => void;
}) {
  const moodOptions: { value: Mood; id: string; label: string; icon: string }[] = [
    {
      value: "VERY_HAPPY",
      id: "very-happy",
      label: "Very Happy",
      icon: "/logMood-icons/very-happy.svg",
    },
    { value: "HAPPY", id: "happy", label: "Happy", icon: "/logMood-icons/Happy.svg" },
    {
      value: "NEUTRAL",
      id: "neutral",
      label: "Neutral",
      icon: "/logMood-icons/Neutral.svg",
    },
    { value: "SAD", id: "sad", label: "Sad", icon: "/logMood-icons/Sad.svg" },
    {
      value: "VERY_SAD",
      id: "very-sad",
      label: "Very Sad",
      icon: "/logMood-icons/very-sad.svg",
    },
  ];

  return (
    <RadioGroup
      value={mood ?? ""}
      onValueChange={(value) => {
        if (isMood(value)) {
          setMood(value);
        }
      }}
    >
      {moodOptions.map((option) => (
        <div
          key={option.id}
          className="flex items-center justify-between bg-card border-2 border-border rounded-lg px-5 py-3 cursor-pointer hover:bg-muted-foreground/10"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value={option.value} id={option.id} />
            <Label
              className="text-xl leading-[140%] font-semibold cursor-pointer"
              htmlFor={option.id}
            >
              {option.label}
            </Label>
          </div>
          <Image src={option.icon} alt={option.label} width={38} height={38} />
        </div>
      ))}
    </RadioGroup>
  );
}

function MoodStepTwo({
  feelings,
  setFeelings,
  setErrorMessage,
}: {
  feelings: string[];
  setFeelings: (feelings: string[]) => void;
  setErrorMessage: (errorMessage: string | null) => void;
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

  if (feelings.length > 3) {
    setErrorMessage("You can only select a maximum of 3 tags.");
  }

  return (
    <div className="flex flex-wrap gap-3">
      {feelingsOptions.map((feelingOption) => (
        <div
          key={feelingOption}
          className="flex items-center gap-3 bg-card border-2 border-border focus-within:border-primary rounded-lg px-3 py-4"
        >
          <Checkbox
            id={feelingOption}
            value={feelingOption}
            onCheckedChange={(checked) => {
              if (checked) {
                setFeelings([...feelings, feelingOption]);
              } else {
                setFeelings(feelings.filter((f) => f !== feelingOption));
              }
            }}
            checked={feelings.includes(feelingOption)}
          />
          <Label
            className="text-xl leading-[140%] font-semibold"
            htmlFor={feelingOption}
          >
            {feelingOption}
          </Label>
        </div>
      ))}
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
  sleepHours: number | null;
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
      value={sleepHours !== null ? sleepHours.toString() : ""}
      onValueChange={(value) => setSleepHours(parseInt(value))}
    >
      {sleepHoursOptions.map((option, index) => (
        <div
          key={option}
          className="flex items-center justify-between bg-card border-2 border-border rounded-lg px-5 py-3 focus-within:border-primary"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value={index.toString()} id={option} />
            <Label
              className="text-xl leading-[140%] font-semibold"
              htmlFor={option}
            >
              {option}
            </Label>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
}
