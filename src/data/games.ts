// Mini-games data for each mission

export type GameType = "order-events" | "true-false" | "fill-blank" | "matching";

export interface OrderEventsGame {
  type: "order-events";
  missionId: string;
  title: string;
  instruction: string;
  events: string[]; // correct order
}

export interface TrueFalseGame {
  type: "true-false";
  missionId: string;
  title: string;
  instruction: string;
  statements: { text: string; isTrue: boolean; explanation: string }[];
}

export interface FillBlankGame {
  type: "fill-blank";
  missionId: string;
  title: string;
  instruction: string;
  sentences: { text: string; blank: string; options: string[] }[];
}

export interface MatchingGame {
  type: "matching";
  missionId: string;
  title: string;
  instruction: string;
  pairs: { left: string; right: string }[];
}

export type MissionGame = OrderEventsGame | TrueFalseGame | FillBlankGame | MatchingGame;

export const missionGames: MissionGame[] = [
  {
    type: "order-events",
    missionId: "apollo-13",
    title: "Timeline Challenge",
    instruction: "Put these Apollo 13 events in the correct order",
    events: [
      "Launch from Kennedy Space Center",
      "Oxygen tank explodes in Service Module",
      "Crew powers down Command Module",
      "Lunar Module used as lifeboat",
      "Free-return trajectory around the Moon",
      "Crew safely splashes down in Pacific Ocean",
    ],
  },
  {
    type: "true-false",
    missionId: "mars-climate-orbiter",
    title: "Fact or Fiction",
    instruction: "Decide if each statement about Mars Climate Orbiter is true or false",
    statements: [
      { text: "The spacecraft was lost due to a software crash.", isTrue: false, explanation: "It was lost due to a unit mismatch — imperial vs. metric — not a software crash." },
      { text: "One team used pound-force seconds while the other used newton-seconds.", isTrue: true, explanation: "Lockheed Martin used imperial units; NASA's JPL expected metric." },
      { text: "The mission cost approximately $327 million.", isTrue: true, explanation: "The total mission cost was about $327 million." },
      { text: "The orbiter successfully entered Mars orbit before failing.", isTrue: false, explanation: "It never entered orbit — it came too close and was destroyed in the atmosphere." },
      { text: "This is known as the most famous unit conversion error in engineering.", isTrue: true, explanation: "It became the textbook example of unit conversion failures." },
    ],
  },
  {
    type: "fill-blank",
    missionId: "schiaparelli-edm",
    title: "Fill the Gap",
    instruction: "Complete each sentence about the Schiaparelli lander",
    sentences: [
      { text: "Schiaparelli's ___ saturated during descent, providing wrong data.", blank: "IMU", options: ["IMU", "GPS", "Camera", "Radar"] },
      { text: "The navigation system computed a ___ altitude.", blank: "negative", options: ["negative", "zero", "maximum", "random"] },
      { text: "The lander was still ___ km above the surface when thrusters stopped.", blank: "3.7", options: ["3.7", "10", "0.5", "1.2"] },
      { text: "Schiaparelli was part of the ___ mission.", blank: "ExoMars", options: ["ExoMars", "Rosetta", "Voyager", "Cassini"] },
    ],
  },
  {
    type: "matching",
    missionId: "beagle-2",
    title: "Match Up",
    instruction: "Match each fact about Beagle 2 to its detail",
    pairs: [
      { left: "Landing year", right: "2003" },
      { left: "Found by", right: "NASA's MRO in 2015" },
      { left: "Problem", right: "Solar panels didn't fully deploy" },
      { left: "Parent mission", right: "Mars Express" },
      { left: "Country of origin", right: "United Kingdom" },
    ],
  },
  {
    type: "order-events",
    missionId: "genesis",
    title: "Sequence the Events",
    instruction: "Order the Genesis mission events correctly",
    events: [
      "Spacecraft launched to collect solar wind",
      "Solar wind particles collected for over 2 years",
      "Sample capsule begins return to Earth",
      "Gravity switch sensor fails (installed backwards)",
      "Drogue parachute does not deploy",
      "Capsule crashes into Utah desert at 311 km/h",
    ],
  },
  {
    type: "true-false",
    missionId: "chandrayaan-2",
    title: "True or False",
    instruction: "Test your knowledge about Chandrayaan-2 Vikram",
    statements: [
      { text: "Vikram lost communication at 2.1 km above the lunar surface.", isTrue: true, explanation: "Communication was lost during the fine braking phase at about 2.1 km altitude." },
      { text: "The Chandrayaan-2 orbiter also failed.", isTrue: false, explanation: "The orbiter continues to function successfully — only the lander failed." },
      { text: "India became the 4th country to soft-land on the Moon with Chandrayaan-2.", isTrue: false, explanation: "That happened with Chandrayaan-3 in 2023, not Chandrayaan-2." },
      { text: "ISRO applied lessons from this failure to Chandrayaan-3.", isTrue: true, explanation: "The landing system was redesigned using data from the Vikram failure." },
      { text: "Vikram was attempting to land at the Moon's south pole.", isTrue: true, explanation: "Both Chandrayaan-2 and 3 targeted the lunar south pole region." },
    ],
  },
  {
    type: "fill-blank",
    missionId: "phoenix",
    title: "Complete the Facts",
    instruction: "Fill in the blanks about the Phoenix Mars Lander",
    sentences: [
      { text: "Phoenix landed near Mars's ___ pole.", blank: "north", options: ["north", "south", "east", "equator"] },
      { text: "Phoenix confirmed the existence of water ___ below the surface.", blank: "ice", options: ["ice", "vapor", "liquid", "crystals"] },
      { text: "The mission exceeded its planned ___ -day duration.", blank: "90", options: ["90", "30", "60", "180"] },
      { text: "Phoenix couldn't survive the Martian polar ___.", blank: "winter", options: ["winter", "storm", "summer", "earthquake"] },
    ],
  },
];

export const getGameForMission = (missionId: string): MissionGame | undefined => {
  return missionGames.find((g) => g.missionId === missionId);
};
