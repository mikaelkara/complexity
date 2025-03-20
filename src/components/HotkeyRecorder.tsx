import { useHotkeys, useRecordHotkeys } from "react-hotkeys-hook";

import KeyCombo from "@/components/KeyCombo";
import { Button } from "@/components/ui/button";
import usePlatformDetection from "@/hooks/usePlatformDetection";

const MODIFIER_KEYS = new Set(
  [Key.Meta, Key.Control, Key.Alt, Key.Shift, "ctrl"].map((k) =>
    k.toLowerCase(),
  ),
);

function orderKeys(keys: string[]): string[] {
  const modifierOrder: Record<string, number> = {
    control: 1,
    ctrl: 1,
    meta: 1,
    shift: 2,
    alt: 3,
  };

  return [...keys].sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const aIsModifier = MODIFIER_KEYS.has(aLower);
    const bIsModifier = MODIFIER_KEYS.has(bLower);

    if (aIsModifier && bIsModifier) {
      const aOrder = modifierOrder[aLower] ?? 0;
      const bOrder = modifierOrder[bLower] ?? 0;
      return aOrder - bOrder;
    }
    if (aIsModifier) return -1;
    if (bIsModifier) return 1;
    return 0;
  });
}

function isValidKeyCombination(keys: Set<string>): boolean {
  if (!keys?.size) return false;

  const keyArray = Array.from(keys).map((k) => k.toLowerCase());
  const hasModifier = keyArray.some((k) => MODIFIER_KEYS.has(k));
  const nonModifierKeys = keyArray.filter((k) => !MODIFIER_KEYS.has(k));

  return hasModifier && nonModifierKeys.length === 1;
}

type UseHotkeyRecorderProps = {
  defaultKeys: string[];
  onSave?: (keys: string[]) => void;
};

export function useHotkeyRecorder({
  defaultKeys,
  onSave,
}: UseHotkeyRecorderProps) {
  const isMac = usePlatformDetection() === "mac";
  const [recordedKeys, { isRecording, resetKeys, start, stop }] =
    useRecordHotkeys();

  useHotkeys(Key.Escape, () => stop(), { preventDefault: true });

  const displayKeys = isRecording
    ? recordedKeys?.size
      ? orderKeys(Array.from(recordedKeys))
      : []
    : orderKeys(defaultKeys);

  useEffect(() => {
    if (!recordedKeys?.size) return;

    const nonModifierKeys = Array.from(recordedKeys)
      .map((k) => k.toLowerCase())
      .filter((k) => !MODIFIER_KEYS.has(k));

    if (nonModifierKeys.length > 1) {
      resetKeys();
      stop();
    }
  }, [recordedKeys, resetKeys, stop]);

  const handleStartRecording = () => {
    resetKeys();
    start();
  };

  const handleStopRecording = () => {
    if (!isValidKeyCombination(recordedKeys)) {
      resetKeys();
    } else if (onSave && recordedKeys != null) {
      onSave(orderKeys(Array.from(recordedKeys)));
    }
    stop();
  };

  const isValidCombination =
    recordedKeys != null ? isValidKeyCombination(recordedKeys) : true;

  const HotkeyRecorderUI = () => (
    <div className="x:flex x:flex-col x:gap-3">
      <div className="x:flex x:items-center x:gap-3">
        <div
          className={cn(
            "x:flex x:items-center x:rounded-md",
            isRecording &&
              "x:border x:border-border/50 x:bg-secondary x:px-3 x:py-1.5",
          )}
        >
          {isRecording && !recordedKeys?.size ? (
            <div className="x:flex x:items-center x:gap-2 x:text-sm x:text-muted-foreground">
              <div className="x:h-1.5 x:w-1.5 x:animate-pulse x:rounded-full x:bg-primary" />
              Recording...
            </div>
          ) : (
            <KeyCombo keys={formatKeys(displayKeys)} />
          )}
        </div>
        {isRecording ? (
          !isValidCombination ? null : (
            <Button
              variant="outline"
              size="sm"
              className="x:min-w-[80px]"
              onClick={handleStopRecording}
            >
              Save
            </Button>
          )
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="x:min-w-[80px]"
            onClick={handleStartRecording}
          >
            Record
          </Button>
        )}
      </div>
      {isRecording && !isValidCombination && recordedKeys?.size > 0 && (
        <div className="x:flex x:items-center x:gap-2 x:text-sm x:text-destructive">
          <div className="x:i-lucide-alert-circle x:h-4 x:w-4" />
          Invalid combination. Use one modifier key ({isMac
            ? "⌘"
            : "Ctrl"}, {isMac ? "⌥" : "Alt"}, {isMac ? "⇧" : "Shift"}) + one
          regular key
        </div>
      )}
    </div>
  );

  return {
    HotkeyRecorderUI,
    isRecording,
    keys: recordedKeys != null ? orderKeys(Array.from(recordedKeys)) : [],
    startRecording: handleStartRecording,
    stopRecording: handleStopRecording,
    isValidCombination,
  };
}

export function formatKeys(keys: string[]): string[] {
  return keys.map((key) => key.charAt(0).toUpperCase() + key.slice(1));
}
