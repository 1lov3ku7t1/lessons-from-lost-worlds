import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ─── pixel color palette (8-bit space theme) ─── */
const C = {
  bg: "#0b0e17",
  stars: "#ffffff",
  starDim: "#555577",
  ship: "#c0c0c0",
  shipLight: "#e0e0e0",
  shipDark: "#808090",
  flame: "#ff6622",
  flameYellow: "#ffcc00",
  explosion: "#ff4400",
  explosionYellow: "#ffaa00",
  mars: "#cc4422",
  marsDark: "#993311",
  marsLight: "#dd6644",
  moon: "#ccccaa",
  moonDark: "#999977",
  earth: "#4488cc",
  earthGreen: "#44aa66",
  earthDark: "#336699",
  ice: "#aaddff",
  iceDark: "#77aacc",
  solar: "#ffdd44",
  solarDark: "#cc9900",
  panel: "#3366aa",
  panelDark: "#224488",
  antenna: "#aaaaaa",
  warning: "#ff3333",
  success: "#44dd66",
  parachute: "#ff6644",
  desert: "#ddaa66",
  desertDark: "#bb8844",
  text: "#ffffff",
};

/* ─── per-mission animation renderers ─── */
type Renderer = (ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) => void;

const px = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x) * size, Math.floor(y) * size, size, size);
};

const drawStars = (ctx: CanvasRenderingContext2D, w: number, h: number, s: number, frame: number, seed: number = 42) => {
  let rng = seed;
  const next = () => { rng = (rng * 16807 + 0) % 2147483647; return rng / 2147483647; };
  for (let i = 0; i < 30; i++) {
    const sx = Math.floor(next() * (w / s));
    const sy = Math.floor(next() * (h / s));
    const twinkle = (frame + i * 7) % 40 < 30;
    px(ctx, sx, sy, s, twinkle ? C.stars : C.starDim);
  }
};

const drawPixelShip = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  // Simple spacecraft shape
  const shape = [
    [0,0,0,1,0,0,0],
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [0,1,1,1,1,1,0],
    [1,1,0,1,0,1,1],
    [1,0,0,1,0,0,1],
  ];
  shape.forEach((row, ry) => {
    row.forEach((val, rx) => {
      if (val) px(ctx, x + rx, y + ry, s, ry < 2 ? C.shipLight : C.ship);
    });
  });
};

const drawExplosion = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number, radius: number = 4) => {
  const r = Math.min(radius, Math.floor(frame / 3) + 1);
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) {
        const isOuter = dx * dx + dy * dy > (r - 1) * (r - 1);
        const flicker = (frame + dx + dy) % 3 !== 0;
        if (flicker) px(ctx, x + dx, y + dy, s, isOuter ? C.explosionYellow : C.explosion);
      }
    }
  }
};

/* ── Apollo 13: Explosion in transit, lifeboat return ── */
const renderApollo13: Renderer = (ctx, w, h, frame) => {
  const s = 4; // pixel size
  const cols = w / s, rows = h / s;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, s, frame, 13);

  // Earth on left
  for (let dy = -6; dy <= 6; dy++) {
    for (let dx = -6; dx <= 6; dx++) {
      if (dx * dx + dy * dy <= 36) {
        const isLand = ((dx + dy + 20) * 7) % 11 > 5;
        px(ctx, 6 + dx, rows / 2 + dy, s, isLand ? C.earthGreen : C.earth);
      }
    }
  }

  // Moon on right
  for (let dy = -4; dy <= 4; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      if (dx * dx + dy * dy <= 16) {
        const crater = (dx * 3 + dy * 7 + 50) % 9 < 2;
        px(ctx, cols - 10 + dx, rows / 2 + dy, s, crater ? C.moonDark : C.moon);
      }
    }
  }

  const phase = frame % 180;

  if (phase < 60) {
    // Phase 1: Ship flying toward moon
    const shipX = 16 + phase * 0.6;
    const shipY = rows / 2 - 3;
    drawPixelShip(ctx, shipX, shipY, s);
    // Thruster flame
    if (frame % 4 < 2) px(ctx, shipX + 3, shipY + 6, s, C.flame);
    if (frame % 6 < 3) px(ctx, shipX + 3, shipY + 7, s, C.flameYellow);
  } else if (phase < 100) {
    // Phase 2: Explosion!
    const shipX = 52;
    const shipY = rows / 2 - 3;
    drawPixelShip(ctx, shipX, shipY, s);
    drawExplosion(ctx, shipX + 7, shipY + 2, s, phase - 60, 5);
    // Warning flash
    if (phase % 6 < 3) {
      ctx.fillStyle = C.warning;
      ctx.font = `${s * 2}px monospace`;
      ctx.fillText("!", (shipX + 9) * s, (shipY + 1) * s);
    }
  } else {
    // Phase 3: Ship returns to earth (slingshot path)
    const t = (phase - 100) / 80;
    const shipX = 52 - t * 40;
    const shipY = rows / 2 - 3 - Math.sin(t * Math.PI) * 8;
    drawPixelShip(ctx, shipX, shipY, s);
    if (frame % 4 < 2) px(ctx, shipX + 3, shipY + 6, s, C.flame);
  }
};

/* ── Mars Climate Orbiter: Wrong units, crashes into Mars ── */
const renderMarsClimate: Renderer = (ctx, w, h, frame) => {
  const s = 4;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, s, frame, 99);

  // Mars
  const mx = cols / 2, my = rows / 2;
  for (let dy = -8; dy <= 8; dy++) {
    for (let dx = -8; dx <= 8; dx++) {
      if (dx * dx + dy * dy <= 64) {
        const terrain = (dx * 5 + dy * 3 + 30) % 7 < 2;
        px(ctx, mx + dx, my + dy, s, terrain ? C.marsLight : C.mars);
      }
    }
  }

  // Atmosphere glow
  for (let dy = -10; dy <= 10; dy++) {
    for (let dx = -10; dx <= 10; dx++) {
      const d = dx * dx + dy * dy;
      if (d > 64 && d <= 100 && (dx + dy + frame) % 5 === 0) {
        px(ctx, mx + dx, my + dy, s, C.marsDark);
      }
    }
  }

  const phase = frame % 120;
  if (phase < 80) {
    // Ship approaching — wrong trajectory (too close)
    const angle = -Math.PI / 2 + (phase / 80) * Math.PI * 0.8;
    const radius = 18 - phase * 0.15;
    const sx = mx + Math.cos(angle) * radius;
    const sy = my + Math.sin(angle) * radius;
    drawPixelShip(ctx, sx - 3, sy - 3, s);

    // Unit labels flickering
    if (phase > 30 && phase % 10 < 5) {
      ctx.fillStyle = C.warning;
      ctx.font = `bold ${s * 2.5}px monospace`;
      ctx.fillText("lb·s ≠ N·s", s * 2, s * 4);
    }
  } else {
    // Crash into atmosphere
    const t = (phase - 80) / 40;
    drawExplosion(ctx, mx - 6, my - 9, s, phase - 80, 6);
    if (phase % 4 < 2) {
      ctx.fillStyle = C.explosionYellow;
      ctx.font = `${s * 2}px monospace`;
    }
  }
};

/* ── Schiaparelli: Thinks it landed, crashes from 3.7km ── */
const renderSchiaparelli: Renderer = (ctx, w, h, frame) => {
  const s = 4;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, s, frame, 16);

  // Mars surface at bottom
  for (let x = 0; x < cols; x++) {
    const height = 6 + Math.floor(Math.sin(x * 0.5) * 2);
    for (let y = 0; y < height; y++) {
      px(ctx, x, rows - y, s, y < 2 ? C.marsLight : C.mars);
    }
  }

  const phase = frame % 150;

  if (phase < 50) {
    // Descending with parachute
    const shipY = 4 + phase * 0.3;
    const shipX = cols / 2 - 3;
    // Parachute
    for (let dx = -4; dx <= 4; dx++) {
      px(ctx, shipX + 3 + dx, shipY - 3, s, C.parachute);
      if (Math.abs(dx) < 4) px(ctx, shipX + 3 + dx, shipY - 4, s, C.parachute);
    }
    px(ctx, shipX + 3, shipY - 2, s, C.antenna);
    drawPixelShip(ctx, shipX, shipY, s);

    // Altitude reading
    const alt = Math.max(0, Math.floor(3.7 - phase * 0.05));
    ctx.fillStyle = C.success;
    ctx.font = `${s * 2}px monospace`;
    ctx.fillText(`ALT: ${alt}km`, s * 2, s * 4);
  } else if (phase < 70) {
    // Computer glitch — shows negative altitude, cuts thrusters
    const shipY = 19;
    const shipX = cols / 2 - 3;
    drawPixelShip(ctx, shipX, shipY, s);

    // Glitch effect
    ctx.fillStyle = C.warning;
    ctx.font = `bold ${s * 2.5}px monospace`;
    ctx.fillText("ALT: -" + ((phase - 50) * 12) + "m", s * 1, s * 4);
    ctx.fillText("LANDED ✓", s * 1, s * 7);

    // Screen glitch lines
    if (phase % 3 === 0) {
      ctx.fillStyle = `rgba(255,50,50,0.3)`;
      ctx.fillRect(0, (phase * 7) % h, w, s);
    }
  } else {
    // Free fall and crash
    const t = (phase - 70) / 30;
    const fallY = 19 + t * (rows - 30);
    const shipX = cols / 2 - 3;

    if (t < 0.8) {
      drawPixelShip(ctx, shipX, fallY, s);
    } else {
      drawExplosion(ctx, shipX + 3, rows - 8, s, Math.floor((t - 0.8) * 100), 5);
    }
  }
};

/* ── Beagle 2: Lands OK, panels don't deploy ── */
const renderBeagle2: Renderer = (ctx, w, h, frame) => {
  const s = 4;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);

  // Mars surface
  for (let x = 0; x < cols; x++) {
    const height = 8 + Math.floor(Math.sin(x * 0.3 + 1) * 2);
    for (let y = 0; y < height; y++) {
      px(ctx, x, rows - y, s, y < 2 ? C.marsLight : C.mars);
    }
  }

  const cx = cols / 2, cy = rows - 12;
  const phase = frame % 160;

  if (phase < 40) {
    // Landing
    const t = phase / 40;
    const ly = 2 + t * (cy - 2);
    drawPixelShip(ctx, cx - 3, ly, s);
    if (phase % 4 < 2) px(ctx, cx, ly + 6, s, C.flame);
  } else if (phase < 60) {
    // Landed successfully
    drawPixelShip(ctx, cx - 3, cy, s);
    ctx.fillStyle = C.success;
    ctx.font = `${s * 2}px monospace`;
    ctx.fillText("LANDED ✓", s * 2, s * 4);
  } else {
    // Panels try to deploy — stuck
    drawPixelShip(ctx, cx - 3, cy, s);

    // Partial solar panels
    const deployT = Math.min(1, (phase - 60) / 30);
    const panelLen = Math.floor(deployT * 3);

    // Left panel (deploys)
    for (let i = 0; i < panelLen; i++) {
      px(ctx, cx - 4 - i, cy + 1, s, C.panel);
      px(ctx, cx - 4 - i, cy + 2, s, C.panelDark);
    }
    // Right panel (stuck — only partial)
    const rightLen = Math.min(panelLen, 1);
    for (let i = 0; i < rightLen; i++) {
      px(ctx, cx + 4 + i, cy + 1, s, C.panel);
      px(ctx, cx + 4 + i, cy + 2, s, C.panelDark);
    }

    // Antenna blocked indicator
    if (phase > 100) {
      px(ctx, cx, cy - 1, s, C.antenna);
      px(ctx, cx, cy - 2, s, C.antenna);

      // No signal
      if (phase % 8 < 4) {
        ctx.fillStyle = C.warning;
        ctx.font = `${s * 2}px monospace`;
        ctx.fillText("NO SIGNAL", s * 2, s * 4);
      }

      // X over antenna
      ctx.strokeStyle = C.warning;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo((cx - 1) * s, (cy - 3) * s);
      ctx.lineTo((cx + 2) * s, (cy) * s);
      ctx.moveTo((cx + 2) * s, (cy - 3) * s);
      ctx.lineTo((cx - 1) * s, (cy) * s);
      ctx.stroke();
    }
  }
};

/* ── Genesis: Parachute fail, crashes in Utah ── */
const renderGenesis: Renderer = (ctx, w, h, frame) => {
  const s = 4;
  const cols = w / s, rows = h / s;

  // Sky gradient (earth atmosphere)
  ctx.fillStyle = "#1a2a44";
  ctx.fillRect(0, 0, w, h * 0.6);
  ctx.fillStyle = "#446688";
  ctx.fillRect(0, h * 0.6, w, h * 0.4);

  // Desert ground
  for (let x = 0; x < cols; x++) {
    const gh = 4 + Math.floor(Math.sin(x * 0.2) * 1.5);
    for (let y = 0; y < gh; y++) {
      px(ctx, x, rows - y, s, y === gh - 1 ? C.desert : C.desertDark);
    }
  }

  const phase = frame % 140;
  const cx = cols / 2;

  if (phase < 50) {
    // Capsule descending — parachute tries but fails
    const cy = 4 + phase * 0.5;
    // Capsule (small rounded)
    px(ctx, cx - 1, cy, s, C.ship);
    px(ctx, cx, cy, s, C.shipLight);
    px(ctx, cx + 1, cy, s, C.ship);
    px(ctx, cx - 1, cy + 1, s, C.shipDark);
    px(ctx, cx, cy + 1, s, C.ship);
    px(ctx, cx + 1, cy + 1, s, C.shipDark);

    // Parachute sparking/failing
    if (phase > 20 && phase % 6 < 3) {
      ctx.fillStyle = C.warning;
      ctx.font = `${s * 2}px monospace`;
      ctx.fillText("CHUTE FAIL", s * 2, s * 3);
    }

    // Small sparks where chute should be
    if (phase > 20 && phase % 4 < 2) {
      px(ctx, cx + ((frame * 3) % 5) - 2, cy - 1, s, C.flameYellow);
    }
  } else if (phase < 80) {
    // Free fall — accelerating
    const t = (phase - 50) / 30;
    const cy = 29 + t * (rows - 36);

    px(ctx, cx - 1, cy, s, C.ship);
    px(ctx, cx, cy, s, C.shipLight);
    px(ctx, cx + 1, cy, s, C.ship);
    px(ctx, cx, cy + 1, s, C.shipDark);

    // Speed indicator
    ctx.fillStyle = C.warning;
    ctx.font = `bold ${s * 2}px monospace`;
    ctx.fillText(`${Math.floor(100 + t * 211)} km/h`, s * 2, s * 3);
  } else {
    // Impact and dust cloud
    const impactT = phase - 80;
    drawExplosion(ctx, cx, rows - 7, s, impactT, 6);

    // Dust particles
    for (let i = 0; i < impactT; i++) {
      const dx = Math.sin(i * 2.5) * impactT * 0.4;
      const dy = -Math.abs(Math.cos(i * 1.7)) * impactT * 0.3;
      px(ctx, cx + dx, rows - 7 + dy, s, C.desert);
    }

    // But samples survived!
    if (impactT > 30 && impactT % 8 < 5) {
      ctx.fillStyle = C.success;
      ctx.font = `${s * 2}px monospace`;
      ctx.fillText("SAMPLES OK!", s * 2, s * 3);
    }
  }
};

/* ── Chandrayaan-2: Lost signal during final descent ── */
const renderChandrayaan2: Renderer = (ctx, w, h, frame) => {
  const s = 4;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, s, frame, 19);

  // Moon surface
  for (let x = 0; x < cols; x++) {
    const height = 6 + Math.floor(Math.sin(x * 0.4 + 2) * 2);
    for (let y = 0; y < height; y++) {
      const crater = (x * 3 + y * 7) % 11 < 2;
      px(ctx, x, rows - y, s, crater ? C.moonDark : C.moon);
    }
  }

  const phase = frame % 140;
  const cx = cols / 2;

  if (phase < 60) {
    // Vikram descending with braking
    const t = phase / 60;
    const vy = 4 + t * 20;
    drawPixelShip(ctx, cx - 3, vy, s);

    // Braking thrusters
    for (let i = 0; i < 3; i++) {
      if ((frame + i) % 3 < 2) {
        px(ctx, cx - 1 + i, vy + 7, s, C.flame);
        px(ctx, cx - 1 + i, vy + 8, s, C.flameYellow);
      }
    }

    // Altitude
    const alt = (2.1 - t * 2.1).toFixed(1);
    ctx.fillStyle = C.success;
    ctx.font = `${s * 2}px monospace`;
    ctx.fillText(`ALT: ${alt}km`, s * 2, s * 4);
  } else if (phase < 90) {
    // Signal lost — ship veers off
    const t = (phase - 60) / 30;
    const vy = 24 + t * 6;
    const vx = cx - 3 + t * 5;
    drawPixelShip(ctx, vx, vy, s);

    // Signal lost indicator
    if (phase % 4 < 2) {
      ctx.fillStyle = C.warning;
      ctx.font = `bold ${s * 2.5}px monospace`;
      ctx.fillText("SIGNAL LOST", s, s * 4);
    }

    // Static lines
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = `rgba(255,255,255,0.1)`;
      ctx.fillRect(0, ((phase * 13 + i * 31) % h), w, 2);
    }
  } else {
    // Crash + hope message
    drawExplosion(ctx, cx + 3, rows - 9, s, phase - 90, 5);

    if (phase > 120 && phase % 6 < 4) {
      ctx.fillStyle = C.success;
      ctx.font = `${s * 1.8}px monospace`;
      ctx.fillText("CH-3 will succeed →", s, s * 4);
    }
  }
};

/* ── Phoenix: Success! Lands, finds ice ── */
const renderPhoenix: Renderer = (ctx, w, h, frame) => {
  const s = 4;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = "#0a0e1a";
  ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, s, frame, 8);

  // Mars north pole surface (icy)
  for (let x = 0; x < cols; x++) {
    const height = 5 + Math.floor(Math.sin(x * 0.35) * 1.5);
    for (let y = 0; y < height; y++) {
      const icy = (x + y) % 5 < 2;
      px(ctx, x, rows - y, s, icy ? C.ice : C.mars);
    }
  }

  const phase = frame % 180;
  const cx = cols / 2;

  if (phase < 50) {
    // Landing
    const t = phase / 50;
    const ly = 3 + t * (rows - 16);
    drawPixelShip(ctx, cx - 3, ly, s);
    for (let i = 0; i < 3; i++) {
      if ((frame + i) % 3 < 2) px(ctx, cx - 1 + i, ly + 7, s, C.flame);
    }
  } else if (phase < 70) {
    // Landed
    drawPixelShip(ctx, cx - 3, rows - 13, s);
    // Deploy panels
    const dp = Math.min(4, Math.floor((phase - 50) / 3));
    for (let i = 0; i < dp; i++) {
      px(ctx, cx - 4 - i, rows - 12, s, C.panel);
      px(ctx, cx + 4 + i, rows - 12, s, C.panel);
    }
    ctx.fillStyle = C.success;
    ctx.font = `${s * 2}px monospace`;
    ctx.fillText("LANDED ✓", s * 2, s * 4);
  } else if (phase < 130) {
    // Robotic arm digging
    drawPixelShip(ctx, cx - 3, rows - 13, s);
    // Panels
    for (let i = 0; i < 4; i++) {
      px(ctx, cx - 4 - i, rows - 12, s, C.panel);
      px(ctx, cx + 4 + i, rows - 12, s, C.panel);
    }

    // Arm extending down
    const armLen = Math.min(5, Math.floor((phase - 70) / 6));
    for (let i = 0; i < armLen; i++) {
      px(ctx, cx + 5, rows - 11 + i, s, C.antenna);
    }
    // Digging at tip
    if (armLen >= 5 && phase % 6 < 3) {
      px(ctx, cx + 5, rows - 6, s, C.marsLight);
      px(ctx, cx + 6, rows - 7, s, C.marsLight);
    }

    // Ice discovery!
    if (phase > 110) {
      // Ice pixels revealed
      px(ctx, cx + 5, rows - 5, s, C.ice);
      px(ctx, cx + 6, rows - 5, s, C.iceDark);
      px(ctx, cx + 5, rows - 4, s, C.iceDark);

      ctx.fillStyle = C.ice;
      ctx.font = `bold ${s * 2}px monospace`;
      ctx.fillText("WATER ICE! ❄️", s * 2, s * 4);
    }
  } else {
    // Winter comes
    drawPixelShip(ctx, cx - 3, rows - 13, s);
    for (let i = 0; i < 4; i++) {
      px(ctx, cx - 4 - i, rows - 12, s, C.panelDark);
      px(ctx, cx + 4 + i, rows - 12, s, C.panelDark);
    }

    // Snow/frost particles
    const snowCount = Math.floor((phase - 130) / 2);
    for (let i = 0; i < snowCount; i++) {
      const sx = (i * 13 + frame * 3) % cols;
      const sy = (i * 7 + frame * 2) % rows;
      px(ctx, sx, sy, s, C.ice);
    }

    ctx.fillStyle = C.iceDark;
    ctx.font = `${s * 2}px monospace`;
    ctx.fillText("5 months ✓", s * 2, s * 4);
  }
};

/* ─── registry ─── */
const renderers: Record<string, Renderer> = {
  "apollo-13": renderApollo13,
  "mars-climate-orbiter": renderMarsClimate,
  "schiaparelli-edm": renderSchiaparelli,
  "beagle-2": renderBeagle2,
  "genesis": renderGenesis,
  "chandrayaan-2": renderChandrayaan2,
  "phoenix": renderPhoenix,
};

interface Props {
  missionId: string;
}

const MissionPixelAnimation = ({ missionId }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const renderer = renderers[missionId];

  useEffect(() => {
    if (!renderer || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    let running = true;
    const tick = () => {
      if (!running) return;
      ctx.imageSmoothingEnabled = false;
      renderer(ctx, W, H, frameRef.current);
      frameRef.current++;
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [renderer]);

  if (!renderer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden border border-border/40 shadow-card"
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={320}
          height={180}
          className="w-full h-auto block"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-background/70 backdrop-blur-sm border border-border/30">
          <span className="text-[10px] font-heading font-bold text-primary tracking-wider">8-BIT REPLAY</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MissionPixelAnimation;
