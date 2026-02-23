import { useState, useCallback, useRef } from "react";
import { Volume2, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ListenButtonProps {
  text: string;
}

const ListenButton = ({ text }: ListenButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [text, speed, isPlaying]);

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => { speak(); setShowControls(true); }}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
          isPlaying
            ? "gradient-accent text-primary-foreground shadow-glow"
            : "glass border border-border/40 text-secondary-foreground hover:border-primary/30 hover:text-foreground"
        }`}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        {isPlaying ? "Pause" : "Listen"}
      </button>
      {showControls && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono tabular-nums">{speed.toFixed(1)}×</span>
          <Slider
            value={[speed]}
            onValueChange={handleSpeedChange}
            min={0.5}
            max={2}
            step={0.1}
            className="w-20"
          />
        </div>
      )}
    </div>
  );
};

export default ListenButton;
