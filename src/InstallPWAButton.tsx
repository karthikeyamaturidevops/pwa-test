import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // Chrome uses a special event interface we need to cast
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault(); // stop Chrome mini-infobar
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // trigger chrome install modal
    const result = await deferredPrompt.userChoice;

    console.log("Install outcome:", result.outcome);

    setDeferredPrompt(null); // reset
  };

  // hide button if not available
  if (!deferredPrompt) return null;

  return (
    <button
      onClick={installApp}
      style={{
        padding: "10px 16px",
        background: "#1976d2",
        color: "white",
        border: "1px solid red",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Install App
    </button>
  );
}
