import { useState, useCallback, useRef } from "react";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm text-secondary-foreground"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        {isPlaying ? "Pause" : "Listen"}
      </button>
      {showControls && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{speed.toFixed(1)}×</span>
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
