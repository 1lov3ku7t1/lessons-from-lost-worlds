export type MissionStatus = "Success" | "Partial" | "Failure";

export interface Mission {
  id: string;
  name: string;
  agency: string;
  year: number;
  phase: string;
  status: MissionStatus;
  icon: string;
  image: string;
  summary: string;
  lessonLearned: string;
  keyFact?: string;
  detailText: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
  outcome: string;
  lesson: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const missions: Mission[] = [
  {
    id: "apollo-13",
    name: "Apollo 13",
    agency: "NASA",
    year: 1970,
    phase: "Transit",
    status: "Partial",
    icon: "🌍",
    image: "/images/apollo-13.webp",
    summary: "An oxygen tank exploded en route to the Moon, forcing the crew to abort the landing and use the Lunar Module as a lifeboat to return safely to Earth.",
    lessonLearned: "Redundancy, calm problem-solving, and teamwork can turn a catastrophe into a successful rescue. NASA redesigned the oxygen tanks and added a third tank.",
    keyFact: '"Houston, we\'ve had a problem." — Jack Swigert, April 13, 1970',
    detailText: "Apollo 13 was the seventh crewed mission in the Apollo space program and the third meant to land on the Moon. The mission was commanded by Jim Lovell, with Jack Swigert as Command Module Pilot and Fred Haise as Lunar Module Pilot. Two days after launch, an oxygen tank in the Service Module exploded, crippling the spacecraft. The crew used the Lunar Module as a lifeboat, performing critical course corrections and enduring freezing temperatures to return safely to Earth.",
  },
  {
    id: "mars-climate-orbiter",
    name: "Mars Climate Orbiter",
    agency: "NASA",
    year: 1999,
    phase: "Orbit Insertion",
    status: "Failure",
    icon: "⚙️",
    image: "/images/mars-climate-orbiter.webp",
    summary: "The spacecraft was lost because one engineering team used imperial units while another used metric, causing a navigation error during orbit insertion at Mars.",
    lessonLearned: "Always verify that all teams use the same units. A simple mismatch destroyed a $327 million mission. Double-check interfaces between systems.",
    keyFact: "The 'metric mix-up' has become the most famous unit conversion error in engineering history.",
    detailText: "Mars Climate Orbiter was a robotic space probe launched by NASA to study the Martian climate and atmosphere. During its orbit insertion maneuver, the spacecraft came too close to Mars due to a ground software error — Lockheed Martin used pound-force seconds while NASA's Jet Propulsion Laboratory expected newton-seconds. The probe entered the upper atmosphere and was destroyed.",
  },
  {
    id: "schiaparelli-edm",
    name: "Schiaparelli EDM",
    agency: "ESA",
    year: 2016,
    phase: "Landing",
    status: "Failure",
    icon: "🌙",
    image: "/images/schiaparelli-edm.webp",
    summary: "The lander's computer thought it had already landed while still 3.7 km above the surface, shutting off braking thrusters too early and crashing into Mars.",
    lessonLearned: "Software must handle unexpected sensor data gracefully. The IMU saturated and produced an error that cascaded through the guidance system.",
    keyFact: "Schiaparelli was a technology demonstrator — its crash still provided valuable data for the ExoMars program.",
    detailText: "Schiaparelli EDM (Entry, Descent and Landing Demonstrator Module) was part of ESA's ExoMars 2016 mission. During descent, the Inertial Measurement Unit saturated, providing incorrect attitude data. The navigation system computed a negative altitude, triggering premature parachute release, brief thruster firing, and activation of ground systems while the lander was still nearly 4 km above the surface.",
  },
  {
    id: "beagle-2",
    name: "Beagle 2",
    agency: "ESA",
    year: 2003,
    phase: "Landing",
    status: "Failure",
    icon: "📡",
    image: "/images/beagle-2.webp",
    summary: "The lander successfully touched down on Mars but its solar panels failed to fully deploy, blocking the communications antenna and preventing any contact.",
    lessonLearned: "Mechanical deployment sequences are critical. Redundant communication paths and testing under realistic conditions are essential.",
    keyFact: "Beagle 2 was found intact on Mars by NASA's MRO in 2015 — 12 years after landing.",
    detailText: "Beagle 2 was a British landing craft that formed part of ESA's Mars Express mission. It successfully separated from the orbiter and entered the Martian atmosphere, but contact was never established after landing. In 2015, NASA's Mars Reconnaissance Orbiter found Beagle 2 on the surface with its solar panels only partially deployed.",
  },
  {
    id: "genesis",
    name: "Genesis",
    agency: "NASA",
    year: 2004,
    phase: "Re-entry",
    status: "Partial",
    icon: "☀️",
    image: "/images/genesis.webp",
    summary: "The sample return capsule crashed into the Utah desert at 311 km/h because its drogue parachute failed to deploy — a gravity switch was installed backwards.",
    lessonLearned: "Independent verification of hardware installation is critical. Despite the crash, scientists recovered usable solar wind samples.",
    keyFact: "A sensor the size of a pencil eraser was installed upside-down, causing the parachute failure.",
    detailText: "Genesis was a NASA sample-return mission that collected solar wind particles for over two years. Upon return to Earth, the mortar that should have deployed the drogue parachute never fired because a gravity switch sensor was installed backwards. The capsule hit the desert floor at high speed, but remarkably, many of the collector materials survived and provided valuable scientific data.",
  },
  {
    id: "chandrayaan-2",
    name: "Chandrayaan-2 Vikram",
    agency: "ISRO",
    year: 2019,
    phase: "Landing",
    status: "Failure",
    icon: "🚀",
    image: "/images/chandrayaan-2.webp",
    summary: "The Vikram lander lost communication during its final descent to the Moon's south pole, crashing about 500 meters from the intended landing site.",
    lessonLearned: "Soft-landing on the Moon remains extremely difficult. The guidance software couldn't handle deviations during the braking phase. ISRO applied these lessons to Chandrayaan-3's successful landing in 2023.",
    keyFact: "Chandrayaan-3 succeeded in 2023, making India the 4th country to soft-land on the Moon — and the first at the south pole.",
    detailText: "Chandrayaan-2 was India's second lunar exploration mission. While the orbiter continues to function successfully, the Vikram lander deviated from its planned trajectory during the fine braking phase, just 2.1 km above the lunar surface. Communication was lost, and the lander crashed. ISRO used lessons from this failure to redesign the landing system for Chandrayaan-3.",
  },
  {
    id: "phoenix",
    name: "Phoenix Mars Lander",
    agency: "NASA",
    year: 2008,
    phase: "Surface Operations",
    status: "Success",
    icon: "❄️",
    image: "/images/phoenix.webp",
    summary: "Phoenix successfully landed near Mars's north pole and confirmed the existence of water ice just below the surface. It operated for 5 months before Martian winter ended its mission.",
    lessonLearned: "Even successful missions have limits. Phoenix proved that planning for environmental conditions is crucial — it exceeded its 90-day mission but couldn't survive the polar winter.",
    keyFact: "Phoenix was the first mission to directly sample and analyze Martian water ice.",
    detailText: "Phoenix was a robotic spacecraft that landed on the surface of Mars near its north polar region. It used a robotic arm to dig into the Martian soil and confirmed the presence of water ice. The mission also studied the Martian weather and soil chemistry, providing crucial data about the planet's habitability potential.",
  },
];

export const apolloScenario: ScenarioOption[] = [
  {
    id: "a",
    text: "Attempt to fix the oxygen tank and continue to the Moon",
    isCorrect: false,
    outcome: "The damage was too severe. Attempting repairs would have wasted precious time and resources, likely resulting in loss of crew.",
    lesson: "Sometimes the best decision is to abort the original plan and focus on survival.",
  },
  {
    id: "b",
    text: "Use the Lunar Module as a lifeboat and slingshot around the Moon",
    isCorrect: true,
    outcome: "This is what NASA did. The crew powered down the Command Module, used the LM for life support, and performed a free-return trajectory around the Moon to get home safely.",
    lesson: "Creative problem-solving and using available resources in unexpected ways can save lives. The LM was designed to land on the Moon — not to be a lifeboat — but it worked.",
  },
  {
    id: "c",
    text: "Immediately turn the spacecraft around and head back to Earth",
    isCorrect: false,
    outcome: "A direct abort would have required too much fuel. The spacecraft was already on a trajectory toward the Moon, and reversing course wasn't physically feasible.",
    lesson: "Understanding orbital mechanics matters. Sometimes the fastest way home is to keep going forward.",
  },
  {
    id: "d",
    text: "Jettison the damaged Service Module and use the Command Module alone",
    isCorrect: false,
    outcome: "The Command Module alone didn't have enough power or life support for the return journey. The Service Module, despite damage, still provided structural support.",
    lesson: "In crisis, you must assess all your resources before making a decision. Discarding components prematurely can eliminate options.",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What caused the Mars Climate Orbiter to fail?",
    options: [
      "A software crash during landing",
      "A mismatch between metric and imperial units",
      "Running out of fuel",
      "A communication blackout",
    ],
    correctIndex: 1,
    explanation: "One team used pound-force seconds while the other used newton-seconds, causing a navigation error that sent the spacecraft too close to Mars.",
  },
  {
    id: "q2",
    question: "How did the Apollo 13 crew survive?",
    options: [
      "They repaired the oxygen tank in space",
      "They used an escape pod",
      "They used the Lunar Module as a lifeboat",
      "They waited for a rescue mission",
    ],
    correctIndex: 2,
    explanation: "The crew powered down the Command Module and used the Lunar Module — designed for the Moon landing — as an improvised lifeboat for the journey home.",
  },
  {
    id: "q3",
    question: "Why did the Schiaparelli EDM lander crash on Mars?",
    options: [
      "Its parachute didn't open",
      "It ran out of fuel",
      "Its computer thought it had already landed while still in the air",
      "A dust storm knocked it off course",
    ],
    correctIndex: 2,
    explanation: "The IMU saturated and produced a negative altitude reading, causing the lander to shut off its thrusters while still 3.7 km above the surface.",
  },
  {
    id: "q4",
    question: "What happened to Beagle 2 after it landed on Mars?",
    options: [
      "It sank into soft sand",
      "Its solar panels didn't fully deploy, blocking the antenna",
      "It was destroyed by radiation",
      "Its battery died before it could transmit",
    ],
    correctIndex: 1,
    explanation: "Beagle 2 successfully landed but its solar panels only partially opened, preventing the communications antenna from being exposed.",
  },
  {
    id: "q5",
    question: "What caused the Genesis sample capsule to crash?",
    options: [
      "The heat shield failed",
      "A gravity switch sensor was installed upside-down",
      "The capsule missed its landing zone",
      "High winds pushed it off course",
    ],
    correctIndex: 1,
    explanation: "A tiny gravity switch was installed backwards, preventing the drogue parachute from deploying. The capsule hit the Utah desert at 311 km/h.",
  },
  {
    id: "q6",
    question: "Which mission's failure directly led to a successful follow-up landing at the Moon's south pole?",
    options: [
      "Apollo 13",
      "Beagle 2",
      "Chandrayaan-2 Vikram",
      "Genesis",
    ],
    correctIndex: 2,
    explanation: "ISRO applied lessons from Chandrayaan-2's failed landing to Chandrayaan-3, which successfully soft-landed at the Moon's south pole in 2023.",
  },
];
