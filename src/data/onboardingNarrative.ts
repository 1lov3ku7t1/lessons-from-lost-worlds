export interface NarrativeStep {
  id: number;
  speaker: string;
  text: string;
  emotion: "neutral" | "urgent" | "encouraging" | "dramatic";
  choices?: { label: string; next: number }[];
}

export const narrativeSteps: NarrativeStep[] = [
  {
    id: 0,
    speaker: "Mission Control",
    text: "Welcome to NASA's Jet Propulsion Laboratory. You've just been assigned as a Junior Flight Director. Your job? Learn from history's greatest space missions — the triumphs and the failures.",
    emotion: "neutral",
  },
  {
    id: 1,
    speaker: "Director Chen",
    text: "Every spacecraft that failed taught us something invaluable. A $327 million orbiter lost to a unit conversion error. A lander that thought it was underground while still 4 km in the air. These aren't just stories — they're lessons that save future missions.",
    emotion: "dramatic",
  },
  {
    id: 2,
    speaker: "Director Chen",
    text: "Your training starts now. You'll study seven real missions — analyze what went wrong, make critical decisions under pressure, and prove you have what it takes to lead future missions.",
    emotion: "encouraging",
    choices: [
      { label: "I'm ready. Let's begin.", next: 3 },
      { label: "What will I be learning?", next: 4 },
    ],
  },
  {
    id: 3,
    speaker: "Mission Control",
    text: "Outstanding, Flight Director. Your first briefing is ready. Study each mission carefully — read the reports, run the simulations, and complete the decision scenarios. The future of space exploration depends on learning from the past.",
    emotion: "encouraging",
  },
  {
    id: 4,
    speaker: "Director Chen",
    text: "You'll review seven missions spanning 50 years of space exploration. For each one, you'll analyze telemetry data, walk through what happened step by step, face the same decisions the real engineers faced, and test your knowledge. Ready?",
    emotion: "neutral",
    choices: [
      { label: "Absolutely. Let's go.", next: 3 },
      { label: "Show me the missions.", next: 3 },
    ],
  },
];
