import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function SidebarToggleableRecentThreadsPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const pluginSettings = settings?.plugins["sidebar:toggleableRecentThreads"];

  const handleEnableChange = (checked: boolean) => {
    mutation.mutate((draft) => {
      draft.plugins["sidebar:toggleableRecentThreads"].enabled = checked;
    });
  };

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => handleEnableChange(checked)}
      />

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/5UrguzZ.png"
          alt="sidebar-toggleable-recent-threads"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
