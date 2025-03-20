import { formatKeys } from "@/components/HotkeyRecorder";
import type { ZenModeItem as ZenModeItemType } from "@/data/plugins/command-menu/types";
import BaseMenuItem, {
  BaseCommandMenuItem,
} from "@/plugins/command-menu/components/BaseItem";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

type ZenModeItemProps = BaseCommandMenuItem & ZenModeItemType;

const ZenModeItem = memo((props: ZenModeItemProps) => {
  const settings = ExtensionLocalStorageService.getCachedSync();

  const { action, onSelect, ...baseMenuItemInheritedProps } = props;

  const isZenModeEnabled = $("body").attr("data-cplx-zen-mode") === "true";
  const isItemEnabled = props.type === "enable";

  const shouldShow = isZenModeEnabled !== isItemEnabled;

  if (!shouldShow) return null;

  return (
    <BaseMenuItem
      {...baseMenuItemInheritedProps}
      shortcut={formatKeys(settings?.plugins["zenMode"].hotkey)}
      onSelect={onSelect || action}
    />
  );
});

export default ZenModeItem;
