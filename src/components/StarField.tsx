import { useMemo } from "react";

const StarField = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3,
        opacity: Math.random() * 0.5 + 0.1,
      })),
    []
  );

  const nebulae = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        left: `${20 + Math.random() * 60}%`,
        top: `${10 + Math.random() * 80}%`,
        size: 200 + Math.random() * 300,
        hue: [215, 260, 280][i],
        delay: i * 2,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Nebula blobs */}
      {nebulae.map((n) => (
        <div
          key={`nebula-${n.id}`}
          className="absolute rounded-full animate-pulse-glow"
          style={{
            left: n.left,
            top: n.top,
            width: n.size,
            height: n.size,
            background: `radial-gradient(circle, hsl(${n.hue} 60% 30% / 0.06) 0%, transparent 70%)`,
            animationDelay: `${n.delay}s`,
            filter: "blur(40px)",
          }}
        />
      ))}
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-foreground animate-star-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
