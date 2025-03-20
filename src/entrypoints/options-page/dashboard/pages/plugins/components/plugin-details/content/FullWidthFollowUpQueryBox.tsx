import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function FullWidthFollowUpQueryBoxPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings = settings?.plugins["queryBox:fullWidthFollowUp"];

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:fullWidthFollowUp"].enabled = checked;
          });
        }}
      />

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/lFqauaw.png"
          alt="full-width-follow-up-query-box"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
