export interface LessonPlan {
  missionId: string;
  gradeLevel: string;
  duration: string;
  objectives: string[];
  standards: string[];
  vocabulary: string[];
  discussionPrompts: string[];
  activities: { title: string; description: string; duration: string }[];
  assessment: string;
}

export const lessonPlans: LessonPlan[] = [
  {
    missionId: "apollo-13",
    gradeLevel: "6–12",
    duration: "45–60 min",
    objectives: [
      "Explain how redundancy in engineering systems improves safety",
      "Describe how the Apollo 13 crew used creative problem-solving under pressure",
      "Analyze trade-offs in abort vs. continue decisions",
    ],
    standards: [
      "NGSS MS-ETS1-1: Define design constraints",
      "NGSS HS-ETS1-3: Evaluate competing design solutions",
    ],
    vocabulary: ["Redundancy", "Free-return trajectory", "Life support", "Abort scenario", "Service Module"],
    discussionPrompts: [
      "Why was turning the spacecraft around not an option? What does this teach us about orbital mechanics?",
      "How did the engineering team on the ground collaborate with the crew in space?",
      "What role did the Lunar Module play, even though it was never used for its intended purpose?",
      "How can we apply 'creative reuse of resources' in everyday engineering?",
    ],
    activities: [
      { title: "CO₂ Scrubber Challenge", description: "Using only household materials (cardboard, tape, plastic bags), design a makeshift air filter — mirroring the real Apollo 13 fix.", duration: "20 min" },
      { title: "Decision Tree Exercise", description: "Students map out the decision options the crew faced and evaluate each path's risks and outcomes.", duration: "15 min" },
      { title: "8-Bit Replay & Discussion", description: "Watch the in-app 8-bit animation and identify the key failure point and recovery steps.", duration: "10 min" },
    ],
    assessment: "Students write a one-page 'Mission Report' explaining what went wrong, the solution chosen, and one lesson they can apply to their own projects.",
  },
  {
    missionId: "mars-climate-orbiter",
    gradeLevel: "5–10",
    duration: "30–45 min",
    objectives: [
      "Understand the importance of unit consistency in engineering",
      "Identify how interface errors between teams cause failures",
      "Practice unit conversions between metric and imperial systems",
    ],
    standards: [
      "NGSS MS-ETS1-2: Evaluate competing design solutions",
      "CCSS Math: Unit conversion and dimensional analysis",
    ],
    vocabulary: ["Metric system", "Imperial units", "Newton-seconds", "Pound-force seconds", "Interface management"],
    discussionPrompts: [
      "How could a simple unit error destroy a $327 million mission?",
      "What checks could have caught this error before launch?",
      "Why is standardization important when multiple teams work together?",
      "Can you think of real-world examples where unit errors caused problems?",
    ],
    activities: [
      { title: "Unit Conversion Relay", description: "Teams race to correctly convert measurements between metric and imperial — errors result in 'mission failure'.", duration: "15 min" },
      { title: "Interface Contract Design", description: "Students write a simple 'interface agreement' specifying units, formats, and validation steps between two imaginary teams.", duration: "15 min" },
    ],
    assessment: "Students identify three real-world scenarios where unit/interface errors could cause problems and propose a verification checklist.",
  },
  {
    missionId: "schiaparelli-edm",
    gradeLevel: "7–12",
    duration: "40–50 min",
    objectives: [
      "Explain how sensor errors can cascade through software systems",
      "Understand the concept of sensor saturation and data validation",
      "Analyze how software should handle unexpected input",
    ],
    standards: [
      "NGSS HS-ETS1-2: Design a solution to a complex problem",
      "CS Principles: Data validation and error handling",
    ],
    vocabulary: ["IMU (Inertial Measurement Unit)", "Sensor saturation", "Cascading failure", "Data validation", "Altitude estimation"],
    discussionPrompts: [
      "What does it mean for a sensor to 'saturate'? What happens to the data?",
      "Why did the computer calculate a negative altitude? What should it have done instead?",
      "How can software be designed to question its own sensor readings?",
      "What's the difference between a bug and a design flaw?",
    ],
    activities: [
      { title: "Garbage In, Garbage Out", description: "Students write pseudocode for an altitude checker that validates sensor input and handles impossible values gracefully.", duration: "20 min" },
      { title: "Cascading Failure Diagram", description: "Map the chain of events from sensor error → wrong altitude → premature parachute release → crash.", duration: "15 min" },
    ],
    assessment: "Design a flowchart showing how software should validate sensor data before acting on it, including at least three safety checks.",
  },
  {
    missionId: "beagle-2",
    gradeLevel: "5–9",
    duration: "30–40 min",
    objectives: [
      "Understand why mechanical deployment testing is critical",
      "Explain how a single mechanical failure can end a mission",
      "Discuss the importance of redundant communication systems",
    ],
    standards: [
      "NGSS MS-ETS1-4: Develop a model to generate data for testing",
      "NGSS MS-PS2-2: Plan an investigation with forces",
    ],
    vocabulary: ["Solar panels", "Deployment mechanism", "Communications antenna", "Redundancy", "Mars Reconnaissance Orbiter"],
    discussionPrompts: [
      "Beagle 2 landed successfully but still failed. What does this teach us about mission design?",
      "Why was it important that the solar panels deploy in the correct order?",
      "How did NASA find Beagle 2 twelve years later? What technology made that possible?",
    ],
    activities: [
      { title: "Origami Deployment", description: "Students design a paper mechanism that must unfold in the correct sequence to reveal a hidden message (antenna).", duration: "20 min" },
      { title: "Failure Mode Brainstorm", description: "List 5 things that could go wrong with a folding mechanism in space (temperature, vibration, gravity differences).", duration: "10 min" },
    ],
    assessment: "Draw a redesigned Beagle 2 with at least two backup communication methods and explain each.",
  },
  {
    missionId: "genesis",
    gradeLevel: "6–10",
    duration: "35–45 min",
    objectives: [
      "Explain how independent verification prevents installation errors",
      "Understand how a small component failure can have large consequences",
      "Appreciate how scientists recovered value from a failed mission",
    ],
    standards: [
      "NGSS MS-ETS1-3: Analyze data from tests to improve design",
      "NGSS HS-ETS1-1: Analyze a major global challenge",
    ],
    vocabulary: ["Gravity switch", "Drogue parachute", "Sample return", "Solar wind", "Independent verification"],
    discussionPrompts: [
      "A sensor the size of a pencil eraser caused a $264 million crash. What does this tell us about testing?",
      "What is 'independent verification' and why wasn't it done here?",
      "How were scientists still able to recover useful data from the wreckage?",
    ],
    activities: [
      { title: "Upside-Down Assembly", description: "Students assemble a simple device from instructions, but one step is intentionally ambiguous — demonstrating how installation errors occur.", duration: "15 min" },
      { title: "Verification Checklist", description: "Create a pre-flight verification checklist for a parachute system with at least 5 independent checks.", duration: "15 min" },
    ],
    assessment: "Write a short incident report: What went wrong, why, what was recovered, and what process change would prevent it.",
  },
  {
    missionId: "chandrayaan-2",
    gradeLevel: "6–12",
    duration: "40–50 min",
    objectives: [
      "Understand the difficulty of soft-landing on the Moon",
      "Analyze how failure analysis leads to mission redesign",
      "Appreciate iterative engineering: failure → learning → success",
    ],
    standards: [
      "NGSS HS-ETS1-3: Evaluate a solution to a complex problem",
      "NGSS MS-ETS1-4: Develop a model to test iterative design",
    ],
    vocabulary: ["Soft landing", "Braking phase", "Guidance software", "Lunar south pole", "Iterative design"],
    discussionPrompts: [
      "Chandrayaan-2's orbiter is still working perfectly. Is the mission a total failure?",
      "What specific changes did ISRO make for Chandrayaan-3?",
      "Why is the lunar south pole scientifically interesting?",
      "How does the 'fail → learn → succeed' cycle apply outside of space?",
    ],
    activities: [
      { title: "Egg Lander Challenge", description: "Design a device to soft-land an egg from 2 meters. After the first attempt, analyze failures and redesign — mirroring Chandrayaan-2 → 3.", duration: "25 min" },
      { title: "Iteration Journal", description: "Document what failed, what was learned, and what changed between attempts.", duration: "10 min" },
    ],
    assessment: "Compare Chandrayaan-2 and Chandrayaan-3 in a table: what failed, what was changed, and why each change was made.",
  },
  {
    missionId: "phoenix",
    gradeLevel: "5–9",
    duration: "30–40 min",
    objectives: [
      "Explain how Phoenix confirmed water ice on Mars",
      "Understand environmental limits on mission duration",
      "Discuss what 'mission success' means when there are limits",
    ],
    standards: [
      "NGSS MS-ESS1-3: Analyze data about Earth and other objects in space",
      "NGSS MS-LS2-1: Analyze resources in environments",
    ],
    vocabulary: ["Water ice", "Polar region", "Robotic arm", "Habitability", "Mission extension"],
    discussionPrompts: [
      "Phoenix exceeded its planned 90-day mission. Should we consider it a complete success?",
      "Why is finding water ice on Mars important for future exploration?",
      "What environmental factor ended the mission, and could it have been prevented?",
    ],
    activities: [
      { title: "Mars Weather Report", description: "Research Martian polar conditions and create a 'weather forecast' explaining why Phoenix couldn't survive winter.", duration: "15 min" },
      { title: "Design for Extremes", description: "Sketch modifications to Phoenix that could help it survive a Martian winter.", duration: "15 min" },
    ],
    assessment: "Write a mission summary from Phoenix's perspective: what it accomplished, what it discovered, and how it 'retired'.",
  },
];
