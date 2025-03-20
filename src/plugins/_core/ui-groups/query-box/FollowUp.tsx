import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui-groups/query-box/context/context";
import { createToolbarPortalContainers } from "@/plugins/_core/ui-groups/query-box/utils";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector";
import SlashCommandMenuWrapper from "@/plugins/slash-command-menu";
import SlashCommandMenuTriggerButton from "@/plugins/slash-command-menu/TriggerButton";

export default function FollowUpQueryBoxWrapper() {
  const followUpQueryBox = queryBoxesDomObserverStore(
    (store) => store.followUp.$followUpQueryBox?.[0],
    deepEqual,
  );

  if (!followUpQueryBox) return null;

  const { leftContainer, rightContainer } =
    createToolbarPortalContainers(followUpQueryBox);

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "follow-up" }}>
      <Portal container={leftContainer}>
        <CsUiPluginsGuard
          allowedAccountTypes={[["pro"], ["pro", "enterprise"]]}
          dependentPluginIds={["queryBox:languageModelSelector"]}
        >
          <BetterLanguageModelSelectorWrapper />
        </CsUiPluginsGuard>
      </Portal>
      <Portal container={rightContainer}>
        <div className="x:flex x:flex-wrap x:items-center x:gap-2">
          <CsUiPluginsGuard
            desktopOnly
            dependentPluginIds={["queryBox:slashCommandMenu"]}
            additionalCheck={({ settings }) =>
              settings?.plugins["queryBox:slashCommandMenu"].showTriggerButton
            }
          >
            <SlashCommandMenuTriggerButton />
          </CsUiPluginsGuard>
        </div>
        <CsUiPluginsGuard
          desktopOnly
          dependentPluginIds={["queryBox:slashCommandMenu"]}
        >
          <SlashCommandMenuWrapper anchor={followUpQueryBox} />
        </CsUiPluginsGuard>
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
