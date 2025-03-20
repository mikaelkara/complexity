import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CollapseEmptyThreadVisualColsPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <P>
        Remove the empty space on the right side of each message in a thread.
        Only for messages that explicitly don&apos;t have &quot;Search images,
        Search videos, Generate Images&quot; options on the right.
      </P>
      <Switch
        textLabel="Enable"
        checked={
          settings?.plugins["thread:collapseEmptyThreadVisualCols"].enabled
        }
        onCheckedChange={({ checked }) =>
          mutation.mutate(
            (draft) =>
              (draft.plugins["thread:collapseEmptyThreadVisualCols"].enabled =
                checked),
          )
        }
      />

      <div className="x:mx-auto x:w-full">
        <Image
          src="https://i.imgur.com/DqXvaZp.png"
          alt="collapse-empty-thread-visual-cols"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
