import { sendMessage } from "webext-bridge/content-script";

import FaArrowUpRight from "@/components/icons/FaArrowUpRight";
import { Portal } from "@/components/ui/portal";
import { useSettingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

export default function SettingsDashboardLink() {
  const $topNavWrapper = useSettingsPageDomObserverStore(
    (store) => store.$topNavWrapper,
  );

  const portalContainer = useMemo(() => {
    if ($topNavWrapper == null || !$topNavWrapper.length) return null;

    const $navLinksWrapper = $topNavWrapper.find(
      DOM_SELECTORS.SETTINGS_PAGE.TOP_NAV_CHILD.NAV_LINKS_WRAPPER,
    );

    if (!$navLinksWrapper.length) return null;

    return $navLinksWrapper[0];
  }, [$topNavWrapper]);

  if (portalContainer == null) return null;

  return (
    <Portal container={portalContainer}>
      <div
        className="x:flex x:cursor-pointer x:items-center x:gap-1 x:text-sm x:font-medium x:text-muted-foreground x:transition-all x:hover:text-foreground"
        onClick={() => {
          sendMessage("bg:openOptionsPage", undefined, "background");
        }}
      >
        <FaArrowUpRight className="x:size-[14px]" />
        <div>Complexity</div>
      </div>
    </Portal>
  );
}
