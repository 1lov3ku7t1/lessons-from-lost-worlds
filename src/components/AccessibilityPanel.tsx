import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, X, Type, Eye, Zap, ALargeSmall } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";

const AccessibilityPanel = () => {
  const [open, setOpen] = useState(false);
  const { settings, update } = useAccessibility();

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl gradient-accent shadow-glow flex items-center justify-center hover:opacity-90 transition-all"
        aria-label="Accessibility settings"
      >
        <Settings2 className="w-5 h-5 text-primary-foreground" />
      </button>

      {/* Panel overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto p-6 pb-10"
            >
              <div className="glass rounded-3xl border border-border/40 p-6 shadow-elevated">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <Settings2 className="w-5 h-5 text-primary" />
                    <h2 className="font-heading font-bold text-foreground text-lg">Accessibility</h2>
                  </div>
                  <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Dyslexia Font */}
                  <ToggleRow
                    icon={<Type className="w-4 h-4" />}
                    label="Dyslexia-Friendly Font"
                    desc="OpenDyslexic typeface for easier reading"
                    checked={settings.dyslexiaFont}
                    onChange={(v) => update({ dyslexiaFont: v })}
                  />

                  {/* Font Size */}
                  <div className="glass-subtle rounded-2xl p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <ALargeSmall className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Text Size</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(["small", "medium", "large"] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => update({ fontSize: size })}
                          className={`py-2 rounded-xl text-xs font-heading font-semibold transition-all capitalize ${
                            settings.fontSize === size
                              ? "gradient-accent text-primary-foreground shadow-glow"
                              : "glass border border-border/30 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* High Contrast */}
                  <ToggleRow
                    icon={<Eye className="w-4 h-4" />}
                    label="High Contrast"
                    desc="Increase color contrast for better visibility"
                    checked={settings.highContrast}
                    onChange={(v) => update({ highContrast: v })}
                  />

                  {/* Reduced Motion */}
                  <ToggleRow
                    icon={<Zap className="w-4 h-4" />}
                    label="Reduced Motion"
                    desc="Minimize animations and transitions"
                    checked={settings.reducedMotion}
                    onChange={(v) => update({ reducedMotion: v })}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const ToggleRow = ({
  icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!checked)}
    className="w-full glass-subtle rounded-2xl p-4 flex items-center gap-3 text-left transition-all"
  >
    <div className="text-primary shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
    <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${checked ? "bg-primary" : "bg-border"}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </div>
  </button>
);

export default AccessibilityPanel;
