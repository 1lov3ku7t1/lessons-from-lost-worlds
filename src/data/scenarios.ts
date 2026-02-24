import { ScenarioOption } from "./missions";

export interface MissionScenario {
  missionId: string;
  situation: string;
  options: ScenarioOption[];
}

export const missionScenarios: MissionScenario[] = [
  {
    missionId: "apollo-13",
    situation: "An oxygen tank just exploded. The Command Module is losing power. You're 320,000 km from Earth. What's your call?",
    options: [
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
        outcome: "This is what NASA did. The crew powered down the Command Module, used the LM for life support, and performed a free-return trajectory around the Moon.",
        lesson: "Creative problem-solving and using available resources in unexpected ways can save lives.",
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
        outcome: "The Command Module alone didn't have enough power or life support for the return journey.",
        lesson: "In crisis, assess all your resources before making a decision. Discarding components prematurely can eliminate options.",
      },
    ],
  },
  {
    missionId: "mars-climate-orbiter",
    situation: "You're the lead systems engineer. The orbiter is approaching Mars for orbit insertion. Ground software shows the trajectory is off by a significant margin. What do you do?",
    options: [
      {
        id: "a",
        text: "Proceed with the burn as planned — the software has been tested",
        isCorrect: false,
        outcome: "The spacecraft entered Mars's atmosphere at too low an altitude and was destroyed. The trajectory error was real and the software had a unit mismatch.",
        lesson: "Blind trust in 'tested' software is dangerous. Always verify assumptions, especially at system boundaries.",
      },
      {
        id: "b",
        text: "Delay the burn and audit all navigation data for unit consistency",
        isCorrect: true,
        outcome: "This would have revealed the imperial-vs-metric mismatch between Lockheed Martin's software and NASA's systems, saving the $327 million spacecraft.",
        lesson: "Cross-checking interfaces between teams is critical. A simple unit verification could have saved the entire mission.",
      },
      {
        id: "c",
        text: "Switch to backup navigation and override the primary system",
        isCorrect: false,
        outcome: "The backup system used the same corrupted data. Switching systems wouldn't fix the underlying unit mismatch in the ground software.",
        lesson: "Redundancy only helps if the backup is truly independent. Common-mode failures defeat redundancy.",
      },
      {
        id: "d",
        text: "Abort the orbit insertion and put the spacecraft in a safe holding pattern",
        isCorrect: false,
        outcome: "While safer than proceeding, this wastes fuel and doesn't address the root cause. Without diagnosing the unit error, any future attempt would fail the same way.",
        lesson: "Buying time is useful, but only if you use it to find and fix the root cause.",
      },
    ],
  },
  {
    missionId: "schiaparelli-edm",
    situation: "You're monitoring Schiaparelli's descent to Mars. The IMU is reporting unusual attitude data — the numbers seem to spike beyond expected ranges. The lander is at 4 km altitude. What action do you take?",
    options: [
      {
        id: "a",
        text: "Trust the IMU data and let the autonomous landing sequence continue",
        isCorrect: false,
        outcome: "The saturated IMU data produced a negative altitude calculation, causing the lander to think it was below the surface. It cut thrusters and crashed from 3.7 km.",
        lesson: "Autonomous systems need sanity checks. Trusting bad sensor data without bounds checking leads to catastrophic failures.",
      },
      {
        id: "b",
        text: "Switch to radar altimeter as primary and flag the IMU data as suspect",
        isCorrect: true,
        outcome: "The radar altimeter was providing correct altitude data. Using it as primary would have maintained proper thrust control throughout the descent.",
        lesson: "Sensor fusion with fallback priorities is essential. When one sensor gives impossible readings, the system should automatically switch to alternatives.",
      },
      {
        id: "c",
        text: "Command an immediate engine restart at maximum thrust",
        isCorrect: false,
        outcome: "Without knowing the true altitude, firing engines randomly could waste fuel or even flip the lander. You need correct navigation data first.",
        lesson: "Acting without accurate information can be worse than the original problem. Fix the data source before commanding corrections.",
      },
      {
        id: "d",
        text: "Deploy the parachute again to slow descent while diagnosing",
        isCorrect: false,
        outcome: "The parachute had already been jettisoned. At this phase of powered descent, the parachute system was no longer available.",
        lesson: "Understand the sequence of operations. Some recovery options are only available during specific mission phases.",
      },
    ],
  },
  {
    missionId: "beagle-2",
    situation: "It's been 24 hours since Beagle 2 should have landed on Mars. No signal has been received. The orbiter is in position to relay commands. What's your next move?",
    options: [
      {
        id: "a",
        text: "Send repeated 'phone home' commands through the orbiter relay",
        isCorrect: false,
        outcome: "Commands were sent for weeks, but Beagle 2's antenna was blocked by partially deployed solar panels. No amount of commanding could fix a mechanical deployment failure.",
        lesson: "Communication requires a functioning antenna path. If the hardware is physically blocked, software commands can't help.",
      },
      {
        id: "b",
        text: "Use Mars orbiters to photograph the landing site and assess the lander's state",
        isCorrect: true,
        outcome: "This is eventually what happened — in 2015, NASA's MRO found Beagle 2 intact with partially deployed solar panels. Imaging earlier would have provided answers sooner.",
        lesson: "When communication fails, use alternative observation methods. Orbital imaging can reveal physical state that telemetry cannot.",
      },
      {
        id: "c",
        text: "Assume total loss and redirect resources to the next mission",
        isCorrect: false,
        outcome: "Giving up too quickly means missing the chance to learn from the failure. Understanding why Beagle 2 went silent was crucial for future lander designs.",
        lesson: "Every failure is a learning opportunity. Investigating what went wrong is as important as the mission itself.",
      },
      {
        id: "d",
        text: "Try communicating on emergency backup frequencies",
        isCorrect: false,
        outcome: "Beagle 2 didn't have backup frequencies — its only communication path was through the antenna blocked by the solar panels.",
        lesson: "Redundant communication systems should use physically independent antenna paths, not just different frequencies on the same antenna.",
      },
    ],
  },
  {
    missionId: "genesis",
    situation: "The Genesis sample return capsule is re-entering Earth's atmosphere. Tracking shows the drogue parachute hasn't deployed at the expected altitude. Helicopters are standing by for a mid-air capture. What do you do?",
    options: [
      {
        id: "a",
        text: "Wait — the parachute may deploy at a lower altitude due to atmospheric conditions",
        isCorrect: false,
        outcome: "The parachute never deployed. A gravity switch was installed backwards, so the deployment trigger never fired. The capsule hit the Utah desert at 311 km/h.",
        lesson: "When a critical event doesn't happen on time, assume the worst and activate contingencies immediately.",
      },
      {
        id: "b",
        text: "Send a backup deployment command to trigger the parachute remotely",
        isCorrect: true,
        outcome: "A remote backup trigger could have deployed the chute independently of the faulty gravity switch. Unfortunately, Genesis didn't have this capability.",
        lesson: "Critical single-point failures need independent backup triggers. Remote override capability is essential for recovery systems.",
      },
      {
        id: "c",
        text: "Direct the helicopters to attempt a catch without the parachute",
        isCorrect: false,
        outcome: "Without a parachute, the capsule was falling at terminal velocity — far too fast for any helicopter intercept. This would have endangered the helicopter crews.",
        lesson: "Know the physical limits of your contingency plans. Some rescues are simply not possible beyond certain parameters.",
      },
      {
        id: "d",
        text: "Attempt to steer the capsule to a softer landing area using thrusters",
        isCorrect: false,
        outcome: "Genesis had no thrusters for steering during re-entry. The capsule was a passive ballistic object once it entered the atmosphere.",
        lesson: "Understand what control authority you actually have. Not all spacecraft have active guidance during all mission phases.",
      },
    ],
  },
  {
    missionId: "chandrayaan-2",
    situation: "Vikram lander is in its fine braking phase, 2.1 km above the lunar surface. Telemetry shows the lander deviating from its planned trajectory. Velocity is higher than expected. What's your call?",
    options: [
      {
        id: "a",
        text: "Trust the autonomous landing system to correct the deviation",
        isCorrect: false,
        outcome: "The guidance software couldn't handle the accumulated deviations. The lander lost attitude control and crashed 500 meters from the landing site.",
        lesson: "Autonomous systems have limits. When deviations exceed design margins, human intervention or abort criteria should trigger.",
      },
      {
        id: "b",
        text: "Command an abort — increase thrust to enter a safe orbit and try again",
        isCorrect: true,
        outcome: "An abort-to-orbit would have saved the lander for another landing attempt. The fuel margin was tight but potentially sufficient for a climb-out maneuver.",
        lesson: "Having abort modes at every phase of landing is critical. It's better to delay a landing than to crash. ISRO implemented better abort logic in Chandrayaan-3.",
      },
      {
        id: "c",
        text: "Manually adjust the throttle to compensate for the excess velocity",
        isCorrect: false,
        outcome: "Manual throttle adjustment from Earth has a 1.3-second communication delay to the Moon. At this altitude and speed, the delay makes real-time piloting impossible.",
        lesson: "Communication latency makes real-time remote control impractical for time-critical maneuvers. Pre-programmed abort sequences are essential.",
      },
      {
        id: "d",
        text: "Shift the landing target to a new site that matches current trajectory",
        isCorrect: false,
        outcome: "Retargeting requires extensive navigation recalculation. At 2.1 km altitude with seconds to impact, there's no time to compute and upload a new landing solution.",
        lesson: "Some decisions must be made in advance. Landing site flexibility requires pre-planned alternatives loaded before descent begins.",
      },
    ],
  },
  {
    missionId: "phoenix",
    situation: "Phoenix has been operating on Mars for 90 days — its primary mission is complete. Martian winter is approaching, with declining sunlight. Solar power is dropping daily. How do you use the remaining operational time?",
    options: [
      {
        id: "a",
        text: "Continue all experiments at full power until the batteries die",
        isCorrect: false,
        outcome: "Running everything at full power drains batteries faster, giving less total science. The lander would shut down abruptly, potentially losing unsaved data.",
        lesson: "Resource management matters even at end of mission. Graceful degradation yields more total value than running at full power until sudden failure.",
      },
      {
        id: "b",
        text: "Prioritize the highest-value experiments and power down non-essential systems",
        isCorrect: true,
        outcome: "This is what NASA did. They focused on the most important soil and ice analysis, extending operations to 5 months — well beyond the 90-day primary mission.",
        lesson: "Prioritization extends mission value. By focusing on what matters most and shedding lower-priority tasks, you can exceed original goals.",
      },
      {
        id: "c",
        text: "Put the lander in hibernation to survive winter and wake up in spring",
        isCorrect: false,
        outcome: "Phoenix wasn't designed for hibernation. The extreme cold (-150°C) and CO₂ ice accumulation would destroy the electronics. There was no realistic way to survive winter.",
        lesson: "Understand your hardware's limits. Designing for seasonal survival requires fundamentally different engineering from the start.",
      },
      {
        id: "d",
        text: "Use remaining power to drive to a sunnier location",
        isCorrect: false,
        outcome: "Phoenix was a stationary lander — it had no wheels or mobility system. Unlike rovers, it was fixed at its landing site.",
        lesson: "Know your spacecraft's capabilities. Mission planning must account for what the vehicle can and cannot do.",
      },
    ],
  },
];
