import KeyCombo from "@/components/KeyCombo";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function NoFileCreationOnPastePluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <P>
        Activation hotkey: <KeyCombo keys={["Ctrl", "Shift", "V"]} />.
      </P>
      <Switch
        textLabel="Enable"
        checked={
          settings?.plugins["queryBox:noFileCreationOnPaste"].enabled ?? false
        }
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:noFileCreationOnPaste"].enabled = checked;
          });
        }}
      />
    </div>
  );
}
