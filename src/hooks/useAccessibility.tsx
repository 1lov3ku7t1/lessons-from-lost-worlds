import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilitySettings {
  dyslexiaFont: boolean;
  fontSize: "small" | "medium" | "large";
  highContrast: boolean;
  reducedMotion: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  update: (partial: Partial<AccessibilitySettings>) => void;
}

const defaultSettings: AccessibilitySettings = {
  dyslexiaFont: false,
  fontSize: "medium",
  highContrast: false,
  reducedMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  update: () => {},
});

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem("spacewise-a11y");
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem("spacewise-a11y", JSON.stringify(settings));

    const root = document.documentElement;

    // Dyslexia font
    root.classList.toggle("font-dyslexia", settings.dyslexiaFont);

    // Font size
    root.classList.remove("text-size-small", "text-size-medium", "text-size-large");
    root.classList.add(`text-size-${settings.fontSize}`);

    // High contrast
    root.classList.toggle("high-contrast", settings.highContrast);

    // Reduced motion
    root.classList.toggle("reduce-motion", settings.reducedMotion);
  }, [settings]);

  const update = (partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, update }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
