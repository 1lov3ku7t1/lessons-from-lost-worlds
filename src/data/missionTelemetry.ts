export interface TelemetryPoint {
  time: string; // mission elapsed time or label
  altitude: number; // km
  velocity: number; // km/s
  label?: string; // event annotation
}

export interface MissionTelemetry {
  missionId: string;
  title: string;
  unit: { altitude: string; velocity: string };
  data: TelemetryPoint[];
  keyEvents: { time: string; description: string; type: "info" | "warning" | "critical" }[];
}

export const missionTelemetryData: MissionTelemetry[] = [
  {
    missionId: "apollo-13",
    title: "Apollo 13 — Distance from Earth & Velocity",
    unit: { altitude: "×1000 km", velocity: "km/s" },
    data: [
      { time: "T+0h", altitude: 0, velocity: 11.0, label: "Launch" },
      { time: "T+12h", altitude: 50, velocity: 4.5 },
      { time: "T+24h", altitude: 120, velocity: 3.2 },
      { time: "T+48h", altitude: 250, velocity: 1.8 },
      { time: "T+56h", altitude: 320, velocity: 1.2, label: "💥 Explosion" },
      { time: "T+72h", altitude: 400, velocity: 0.9, label: "Lunar flyby" },
      { time: "T+96h", altitude: 280, velocity: 1.5 },
      { time: "T+120h", altitude: 150, velocity: 3.0 },
      { time: "T+140h", altitude: 30, velocity: 8.5 },
      { time: "T+142h", altitude: 0, velocity: 11.0, label: "Splashdown" },
    ],
    keyEvents: [
      { time: "T+0h", description: "Launch from Kennedy Space Center", type: "info" },
      { time: "T+56h", description: "O₂ tank 2 explosion — power loss in SM", type: "critical" },
      { time: "T+62h", description: "LM activated as lifeboat", type: "warning" },
      { time: "T+72h", description: "Free-return trajectory burn behind Moon", type: "info" },
      { time: "T+142h", description: "Safe splashdown in Pacific Ocean", type: "info" },
    ],
  },
  {
    missionId: "mars-climate-orbiter",
    title: "Mars Climate Orbiter — Planned vs Actual Trajectory",
    unit: { altitude: "km (Mars altitude)", velocity: "km/s" },
    data: [
      { time: "Launch", altitude: 0, velocity: 3.4, label: "Earth departure" },
      { time: "Month 1", altitude: 500, velocity: 3.2 },
      { time: "Month 3", altitude: 400, velocity: 2.8 },
      { time: "Month 5", altitude: 300, velocity: 2.5 },
      { time: "Month 7", altitude: 200, velocity: 2.2 },
      { time: "Month 9", altitude: 150, velocity: 2.0, label: "Planned: 226 km" },
      { time: "Insertion", altitude: 57, velocity: 1.8, label: "Actual: 57 km 💥" },
    ],
    keyEvents: [
      { time: "Launch", description: "Launched Dec 11, 1998", type: "info" },
      { time: "Month 3", description: "Trajectory corrections using imperial-unit data", type: "warning" },
      { time: "Month 7", description: "Navigation team notes trajectory anomaly", type: "warning" },
      { time: "Insertion", description: "Orbiter enters atmosphere at 57 km — destroyed", type: "critical" },
    ],
  },
  {
    missionId: "schiaparelli-edm",
    title: "Schiaparelli — Descent Altitude & Velocity",
    unit: { altitude: "km", velocity: "m/s" },
    data: [
      { time: "Entry", altitude: 121, velocity: 5800 },
      { time: "T+30s", altitude: 110, velocity: 5200 },
      { time: "T+60s", altitude: 90, velocity: 3500 },
      { time: "T+120s", altitude: 40, velocity: 1700 },
      { time: "T+180s", altitude: 11, velocity: 240, label: "Parachute deploy" },
      { time: "T+210s", altitude: 7.8, velocity: 85 },
      { time: "T+230s", altitude: 3.7, velocity: 76, label: "⚠ IMU saturation" },
      { time: "T+233s", altitude: 3.7, velocity: 0, label: "Computer: alt = -1" },
      { time: "T+234s", altitude: 0, velocity: 540, label: "💥 Impact" },
    ],
    keyEvents: [
      { time: "Entry", description: "Atmospheric entry at 121 km", type: "info" },
      { time: "T+180s", description: "Parachute deployed successfully", type: "info" },
      { time: "T+230s", description: "IMU saturates — attitude data corrupted", type: "critical" },
      { time: "T+233s", description: "Navigation computes negative altitude", type: "critical" },
      { time: "T+234s", description: "Thrusters cut, lander crashes at 540 m/s", type: "critical" },
    ],
  },
  {
    missionId: "beagle-2",
    title: "Beagle 2 — Descent Profile",
    unit: { altitude: "km", velocity: "m/s" },
    data: [
      { time: "Separation", altitude: 300, velocity: 0, label: "Orbiter separation" },
      { time: "Entry", altitude: 120, velocity: 5500 },
      { time: "T+60s", altitude: 80, velocity: 3200 },
      { time: "T+120s", altitude: 30, velocity: 1400 },
      { time: "T+180s", altitude: 10, velocity: 300, label: "Parachute" },
      { time: "T+240s", altitude: 2, velocity: 60, label: "Airbag inflation" },
      { time: "Landing", altitude: 0, velocity: 16, label: "✅ Touchdown" },
      { time: "Post-land", altitude: 0, velocity: 0, label: "🔇 No signal" },
    ],
    keyEvents: [
      { time: "Separation", description: "Released from Mars Express orbiter", type: "info" },
      { time: "Landing", description: "Successful touchdown on Isidis Planitia", type: "info" },
      { time: "Post-land", description: "Solar panels partially deploy — antenna blocked", type: "critical" },
    ],
  },
  {
    missionId: "genesis",
    title: "Genesis — Re-entry & Impact",
    unit: { altitude: "km", velocity: "km/h" },
    data: [
      { time: "Entry", altitude: 120, velocity: 40000 },
      { time: "T+30s", altitude: 100, velocity: 35000 },
      { time: "T+60s", altitude: 70, velocity: 25000 },
      { time: "T+90s", altitude: 40, velocity: 12000 },
      { time: "T+120s", altitude: 33, velocity: 1500, label: "⚠ No drogue chute" },
      { time: "T+150s", altitude: 20, velocity: 500 },
      { time: "T+180s", altitude: 10, velocity: 350 },
      { time: "Impact", altitude: 0, velocity: 311, label: "💥 Desert impact" },
    ],
    keyEvents: [
      { time: "Entry", description: "Capsule enters atmosphere from L1 return", type: "info" },
      { time: "T+120s", description: "Drogue chute fails — gravity switch installed backwards", type: "critical" },
      { time: "Impact", description: "Hits Utah desert at 311 km/h", type: "critical" },
      { time: "Impact", description: "Remarkably, solar wind samples partially survived", type: "info" },
    ],
  },
  {
    missionId: "chandrayaan-2",
    title: "Chandrayaan-2 Vikram — Lunar Descent",
    unit: { altitude: "km", velocity: "m/s" },
    data: [
      { time: "Start", altitude: 35, velocity: 1680, label: "Rough braking" },
      { time: "T+300s", altitude: 18, velocity: 820 },
      { time: "T+600s", altitude: 7.4, velocity: 360, label: "Fine braking" },
      { time: "T+720s", altitude: 5, velocity: 200 },
      { time: "T+780s", altitude: 2.1, velocity: 148, label: "⚠ Deviation" },
      { time: "T+800s", altitude: 1.2, velocity: 180, label: "Control lost" },
      { time: "T+810s", altitude: 0.5, velocity: 250 },
      { time: "Impact", altitude: 0, velocity: 300, label: "💥 Crash" },
    ],
    keyEvents: [
      { time: "Start", description: "Rough braking phase begins at 35 km", type: "info" },
      { time: "T+600s", description: "Transition to fine braking phase", type: "info" },
      { time: "T+780s", description: "Lander deviates from planned trajectory", type: "critical" },
      { time: "T+800s", description: "Attitude control lost — velocity increasing", type: "critical" },
      { time: "Impact", description: "Impact 500m from landing site", type: "critical" },
    ],
  },
  {
    missionId: "phoenix",
    title: "Phoenix — Solar Power Over Mission Duration",
    unit: { altitude: "Watt-hours/day", velocity: "°C (temp)" },
    data: [
      { time: "Sol 1", altitude: 900, velocity: -30, label: "Landing" },
      { time: "Sol 15", altitude: 880, velocity: -32 },
      { time: "Sol 30", altitude: 860, velocity: -38 },
      { time: "Sol 60", altitude: 800, velocity: -48 },
      { time: "Sol 90", altitude: 700, velocity: -58, label: "Primary mission end" },
      { time: "Sol 120", altitude: 550, velocity: -72 },
      { time: "Sol 140", altitude: 400, velocity: -85, label: "Power critical" },
      { time: "Sol 152", altitude: 200, velocity: -95, label: "Last contact" },
    ],
    keyEvents: [
      { time: "Sol 1", description: "Successful landing in Vastitas Borealis", type: "info" },
      { time: "Sol 20", description: "Water ice confirmed in soil samples", type: "info" },
      { time: "Sol 90", description: "Primary 90-day mission complete", type: "info" },
      { time: "Sol 140", description: "Power below minimum — systems shutting down", type: "warning" },
      { time: "Sol 152", description: "Final signal received — Martian winter begins", type: "critical" },
    ],
  },
];
