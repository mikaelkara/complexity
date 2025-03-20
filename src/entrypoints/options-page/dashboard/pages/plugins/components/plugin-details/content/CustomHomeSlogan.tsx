import debounce from "lodash/debounce";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CustomHomeSloganPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  const debouncedMutate = useMemo(
    () =>
      debounce((newValue: string) => {
        mutation.mutate(
          (draft) => (draft.plugins["home:customSlogan"].slogan = newValue),
        );
      }, 300),
    [mutation],
  );

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["home:customSlogan"].enabled}
        onCheckedChange={({ checked }) =>
          mutation.mutate(
            (draft) => (draft.plugins["home:customSlogan"].enabled = checked),
          )
        }
      />
      <div className="x:flex x:flex-col x:gap-2">
        <Label className="x:text-muted-foreground">Slogan</Label>
        <Input
          defaultValue={settings?.plugins["home:customSlogan"].slogan}
          onChange={({ target: { value } }) => debouncedMutate(value)}
        />
      </div>
    </div>
  );
}
