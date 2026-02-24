export interface WalkthroughStep {
  title: string;
  content: string;
  checkpoint?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface MissionWalkthrough {
  missionId: string;
  steps: WalkthroughStep[];
}

export const walkthroughs: MissionWalkthrough[] = [
  {
    missionId: "apollo-13",
    steps: [
      {
        title: "The Mission Begins",
        content: "April 11, 1970 — Apollo 13 launches from Kennedy Space Center with astronauts Jim Lovell, Jack Swigert, and Fred Haise. Their goal: land at the Fra Mauro highlands on the Moon. Everything looks perfect.",
      },
      {
        title: "A Routine Task Goes Wrong",
        content: "56 hours into the flight, Mission Control asks the crew to stir the oxygen tanks — a routine procedure. When Swigert flips the switch, oxygen tank #2 explodes. The blast damages tank #1 as well. The Command Module starts losing power and oxygen rapidly.",
        checkpoint: {
          question: "What caused the oxygen tank to explode?",
          options: ["A meteorite strike", "An electrical fault during a routine stir", "Crew error during launch", "A software glitch"],
          correctIndex: 1,
          explanation: "Damaged Teflon insulation on wires inside the tank caused a spark when the tank was stirred, igniting the oxygen and causing the explosion.",
        },
      },
      {
        title: "The Decision: Abort the Landing",
        content: "With the Command Module dying, NASA makes a critical decision: abort the Moon landing. But they can't just turn around — they're already on a trajectory toward the Moon. The crew must slingshot around it using a free-return trajectory.",
        checkpoint: {
          question: "Why couldn't the crew simply reverse course and fly straight back to Earth?",
          options: ["The radio was broken", "They didn't have enough fuel to reverse their trajectory", "The Moon's gravity was too strong", "Earth was on the wrong side"],
          correctIndex: 1,
          explanation: "Reversing course would require enormous fuel. The free-return trajectory used the Moon's gravity to curve back toward Earth with minimal fuel.",
        },
      },
      {
        title: "The Lunar Module Lifeboat",
        content: "The crew moves into the Lunar Module (Aquarius), which was designed to land on the Moon — not sustain three people for four days. They power down almost everything to conserve energy. Temperatures drop near freezing, and water is rationed to 6 ounces per day per person.",
      },
      {
        title: "The CO₂ Crisis",
        content: "The Lunar Module's air scrubbers are overwhelmed by three people's CO₂ output. Engineers on the ground design a makeshift adapter using only materials available on the spacecraft — cardboard, plastic bags, and duct tape. The crew builds it successfully.",
        checkpoint: {
          question: "What everyday material was crucial for the CO₂ scrubber fix?",
          options: ["Aluminum foil", "Duct tape", "String", "Paper clips"],
          correctIndex: 1,
          explanation: "Duct tape, along with cardboard and plastic bags, was used to adapt the square Command Module CO₂ filters to fit the round Lunar Module system.",
        },
      },
      {
        title: "Safe Return",
        content: "On April 17, the crew jettisons the Service Module and Lunar Module, re-enters in the Command Module, and splashes down safely in the Pacific Ocean. All three astronauts survive. NASA calls it a 'successful failure.'",
      },
      {
        title: "Lessons for Engineering",
        content: "Apollo 13 taught NASA that redundancy saves lives, that creative problem-solving under pressure is essential, and that ground teams and astronauts must work as one unit. The oxygen tank system was completely redesigned for future missions.",
        checkpoint: {
          question: "What is the key engineering lesson from Apollo 13?",
          options: ["Never fly to the Moon", "Redundancy and creative problem-solving save lives", "Always carry extra oxygen", "Automation is better than human control"],
          correctIndex: 1,
          explanation: "The mission proved that backup systems, teamwork, and improvisation under pressure are the most critical factors in handling emergencies.",
        },
      },
    ],
  },
  {
    missionId: "mars-climate-orbiter",
    steps: [
      {
        title: "Mission Overview",
        content: "Launched December 1998, Mars Climate Orbiter was designed to study Mars's atmosphere and climate from orbit. It was a $327 million mission managed by NASA's Jet Propulsion Laboratory (JPL), with spacecraft built by Lockheed Martin.",
      },
      {
        title: "The Hidden Error",
        content: "During the 9-month journey to Mars, ground software at Lockheed Martin calculated thruster impulses in pound-force seconds (imperial units). JPL's navigation team expected the data in newton-seconds (metric). Nobody caught the mismatch.",
        checkpoint: {
          question: "Which two units were confused?",
          options: ["Kilometers and miles", "Pound-force seconds and newton-seconds", "Fahrenheit and Celsius", "Gallons and liters"],
          correctIndex: 1,
          explanation: "Lockheed Martin's software output thrust data in pound-force seconds, while JPL expected newton-seconds. 1 lbf·s ≈ 4.45 N·s — a huge difference over months of navigation.",
        },
      },
      {
        title: "Orbit Insertion Disaster",
        content: "On September 23, 1999, the spacecraft approached Mars for orbit insertion. Due to the accumulated navigation error, it flew at just 57 km altitude instead of the planned 226 km. It entered the upper atmosphere and broke apart.",
        checkpoint: {
          question: "How close did the orbiter get to Mars before being destroyed?",
          options: ["226 km (as planned)", "57 km (dangerously low)", "10 km above the surface", "It actually hit the surface"],
          correctIndex: 1,
          explanation: "At 57 km, the spacecraft was deep in the Martian atmosphere where aerodynamic forces tore it apart. It needed to be above 80 km to survive.",
        },
      },
      {
        title: "The Lesson",
        content: "This became the most famous unit conversion error in engineering history. NASA implemented mandatory unit verification protocols and interface checks between all teams. The lesson: when teams share data, they MUST agree on formats and units — explicitly, not by assumption.",
      },
    ],
  },
  {
    missionId: "schiaparelli-edm",
    steps: [
      {
        title: "Technology Demonstrator",
        content: "Schiaparelli was ESA's test lander for the ExoMars program, released from the Trace Gas Orbiter on October 16, 2016. Its job was to prove that ESA could land on Mars — it carried minimal science instruments.",
      },
      {
        title: "Descent Begins Normally",
        content: "The entry and parachute deployment went according to plan. But during the parachute phase, the lander's Inertial Measurement Unit (IMU) experienced 'saturation' — it received rotation data beyond its measurement range.",
        checkpoint: {
          question: "What does 'sensor saturation' mean?",
          options: ["The sensor runs out of power", "The measurement exceeds the sensor's maximum range", "The sensor gets wet", "The sensor overheats"],
          correctIndex: 1,
          explanation: "When a sensor saturates, the actual value exceeds what it can measure. It clips at its maximum, producing incorrect data that the computer treats as valid.",
        },
      },
      {
        title: "The Fatal Cascade",
        content: "The saturated IMU data caused the navigation computer to calculate a negative altitude — it believed the lander was below the surface. This triggered: premature parachute release, only 3 seconds of braking thrust (instead of 30), and activation of ground-contact systems while still 3.7 km up.",
      },
      {
        title: "Impact and Lessons",
        content: "Schiaparelli hit Mars at about 300 km/h. ESA used the failure data to improve software validation for future landers. The key lesson: software must sanity-check sensor data. A negative altitude should have been flagged as impossible.",
        checkpoint: {
          question: "What should the software have done with a negative altitude reading?",
          options: ["Accepted it and continued", "Flagged it as impossible and used backup logic", "Shut down all systems", "Increased thruster power"],
          correctIndex: 1,
          explanation: "Data validation — checking if values are physically possible — is a fundamental software engineering practice that wasn't implemented for this critical parameter.",
        },
      },
    ],
  },
  {
    missionId: "beagle-2",
    steps: [
      {
        title: "A Bold British Mission",
        content: "Beagle 2 was a small British lander launched with ESA's Mars Express in 2003. Named after Darwin's HMS Beagle, it aimed to search for signs of life on Mars. It was built on a tight budget with innovative folding design.",
      },
      {
        title: "Successful Landing, Silent Lander",
        content: "Beagle 2 separated from Mars Express on December 19, 2003 and entered the Martian atmosphere. It was expected to make contact on Christmas Day. But no signal ever came. For over a decade, its fate was unknown.",
        checkpoint: {
          question: "When was Beagle 2 finally found on Mars?",
          options: ["2005", "2010", "2015", "Never found"],
          correctIndex: 2,
          explanation: "In January 2015, NASA's Mars Reconnaissance Orbiter spotted Beagle 2 on the surface — 12 years after landing. It had survived the landing intact.",
        },
      },
      {
        title: "The Solar Panel Problem",
        content: "Images showed that only 2 or 3 of 4 solar panels had deployed. The communications antenna was located underneath the final panel. Without full deployment, the antenna was blocked and could never transmit.",
      },
      {
        title: "Engineering Takeaway",
        content: "The lesson: never place critical communications behind a mechanical deployment sequence without redundancy. Future landers should have multiple independent communication paths and test deployment under realistic conditions including Martian gravity and temperature.",
      },
    ],
  },
  {
    missionId: "genesis",
    steps: [
      {
        title: "Collecting Solar Wind",
        content: "Genesis launched in 2001 on a unique mission: collect particles from the solar wind and return them to Earth. For over two years, it exposed ultra-pure collector arrays to the sun at a stable point between Earth and the Sun (L1).",
      },
      {
        title: "The Return",
        content: "On September 8, 2004, the sample return capsule entered Earth's atmosphere over Utah. A helicopter was supposed to catch it mid-air after its parachute opened. But the drogue parachute never deployed.",
        checkpoint: {
          question: "Why didn't the parachute deploy?",
          options: ["It was packed incorrectly", "A gravity switch sensor was installed upside-down", "The heat shield melted through the parachute", "High winds tangled the lines"],
          correctIndex: 1,
          explanation: "A tiny gravity switch — about the size of a pencil eraser — was installed 180° backwards. It was supposed to detect deceleration and trigger the parachute mortar, but oriented incorrectly it never fired.",
        },
      },
      {
        title: "Impact and Recovery",
        content: "The capsule hit the Utah desert at 311 km/h, shattering the collector arrays. But remarkably, scientists were able to recover usable fragments and extract meaningful solar wind data — the science was partially saved.",
        checkpoint: {
          question: "What process failure allowed the upside-down sensor?",
          options: ["Budget cuts eliminated testing", "No independent verification of installation was performed", "The sensor was a new untested design", "It was sabotage"],
          correctIndex: 1,
          explanation: "The sensor had no independent verification step. No second person checked that it was installed correctly. A simple peer review would have caught the error.",
        },
      },
    ],
  },
  {
    missionId: "chandrayaan-2",
    steps: [
      {
        title: "India Reaches for the Moon",
        content: "Chandrayaan-2 launched in July 2019, aiming to make India the 4th country to soft-land on the Moon. The mission included an orbiter, the Vikram lander, and the Pragyan rover, targeting the lunar south pole.",
      },
      {
        title: "The Final Descent",
        content: "On September 7, 2019, Vikram began its powered descent. The first phase (rough braking) went well, reducing velocity from 1.7 km/s. But during the fine braking phase, just 2.1 km above the surface, the lander deviated from its planned trajectory.",
        checkpoint: {
          question: "At what altitude did Vikram lose control?",
          options: ["10 km", "5 km", "2.1 km", "500 meters"],
          correctIndex: 2,
          explanation: "At 2.1 km altitude, during the critical fine braking phase, the guidance software couldn't correct the trajectory deviation, and communication was lost.",
        },
      },
      {
        title: "From Failure to Triumph",
        content: "ISRO analyzed every data point from the failure. They redesigned the guidance software, added more fuel margin, strengthened the legs, and included a hazard-avoidance system. Chandrayaan-3 launched in 2023 and successfully landed at the Moon's south pole — making India the first to land there.",
        checkpoint: {
          question: "What does Chandrayaan-2 → 3 teach about engineering?",
          options: ["Give up after failure", "Iterative design: fail, learn, redesign, succeed", "Always use more fuel", "Land somewhere easier"],
          correctIndex: 1,
          explanation: "The iterative engineering cycle — analyzing failure, applying lessons, and redesigning — is how all great engineering advances happen.",
        },
      },
    ],
  },
  {
    missionId: "phoenix",
    steps: [
      {
        title: "Following the Water",
        content: "Phoenix launched in 2007, targeting Mars's north polar region. Its mission: dig into the arctic soil and look for water ice. It was the first mission designed specifically to touch and analyze Martian ice.",
      },
      {
        title: "A Perfect Landing",
        content: "On May 25, 2008, Phoenix became the first successful powered landing on Mars since Viking in 1976. It used retro-rockets (no airbags) and touched down precisely in the Green Valley of Vastitas Borealis.",
      },
      {
        title: "Digging for Ice",
        content: "Phoenix's robotic arm dug trenches in the Martian soil. Within days, it exposed white material that sublimated (turned from solid to gas) over several days — confirming it was water ice, not salt or CO₂ ice.",
        checkpoint: {
          question: "How did scientists confirm the white substance was water ice?",
          options: ["Chemical analysis only", "It sublimated (disappeared) over several days", "They tasted it remotely", "X-ray scanning"],
          correctIndex: 1,
          explanation: "Water ice sublimates in Mars's low pressure atmosphere. The white chunks visibly shrank and vanished over days, which wouldn't happen with salt or other minerals.",
        },
      },
      {
        title: "Mission End and Legacy",
        content: "Phoenix operated for 5 months — well beyond its 90-day plan. As Martian winter approached, sunlight decreased and dust accumulated on the solar panels. The last signal came November 2, 2008. Phoenix proved Mars has accessible water ice, a key resource for future human missions.",
        checkpoint: {
          question: "Why is finding water ice on Mars important?",
          options: ["It's not important", "Water can support future human missions (drinking, oxygen, fuel)", "It proves aliens exist", "It means Mars was always cold"],
          correctIndex: 1,
          explanation: "Water ice can be melted for drinking water, split into hydrogen and oxygen for breathing and rocket fuel — making it the most important resource for future Mars exploration.",
        },
      },
    ],
  },
];
