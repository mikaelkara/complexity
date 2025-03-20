import { sendMessage } from "webext-bridge/content-script";

import {
  fastLanguageModels,
  reasoningLanguageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";
import {
  isLanguageModelCode,
  isReasoningLanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import {
  PplxCookieSearchModels,
  PplxCookieSearchModelsSchema,
  PplxCookieSearchModes,
} from "@/plugins/_core/ui-groups/query-box/types";
import { PluginsStatesService } from "@/services/plugins-states";
import { PplxApiService } from "@/services/pplx-api";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";
import { getCookie, jsonUtils, setCookie } from "@/utils/utils";

export function createToolbarPortalContainers(queryBox: HTMLElement): {
  leftContainer: HTMLElement | null;
  rightContainer: HTMLElement | null;
} {
  const $textareaWrapper = $(queryBox).find("textarea").parent();

  const $queryBoxComponentsWrapper = $textareaWrapper.parent();

  $queryBoxComponentsWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.COMPONENTS_WRAPPER,
  );

  const $toolbar = $queryBoxComponentsWrapper.find(">div:nth-child(2)");

  $toolbar
    .find(">div.flex:first-child")
    .internalComponentAttr(
      INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.PPLX_COMPONENTS_WRAPPER,
    );

  const $leftContainer = (() => {
    if (!$toolbar.length) return null;

    const $existingLeftContainer = $toolbar.find(
      `[data-cplx-component="${
        INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.CPLX_COMPONENTS_LEFT_WRAPPER
      }"]`,
    );

    if ($existingLeftContainer.length) return $existingLeftContainer;

    const $newLeftContainer = $("<x:div>").addClass("x:[&:empty]:hidden");

    $newLeftContainer.internalComponentAttr(
      INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.CPLX_COMPONENTS_LEFT_WRAPPER,
    );

    $toolbar.prepend($newLeftContainer);

    return $newLeftContainer;
  })();

  const $rightContainer = (() => {
    if (!$toolbar.length) return null;

    const $existingRightContainer = $toolbar.find(
      `[data-cplx-component="${
        INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.CPLX_COMPONENTS_RIGHT_WRAPPER
      }"]`,
    );

    if ($existingRightContainer.length) return $existingRightContainer;

    const $newRightContainer = $("<x:div>").addClass("x:[&:empty]:hidden");

    $newRightContainer.internalComponentAttr(
      INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.CPLX_COMPONENTS_RIGHT_WRAPPER,
    );

    $toolbar.append($newRightContainer);

    return $newRightContainer;
  })();

  return {
    leftContainer: $leftContainer?.[0] ?? null,
    rightContainer: $rightContainer?.[0] ?? null,
  };
}

export function handleSearchModeChange() {
  const pluginsEnableStates = PluginsStatesService.getEnableStatesCachedSync();

  if (!pluginsEnableStates["queryBox:languageModelSelector"]) return;

  sharedQueryBoxStore.subscribe(
    (store) => ({
      isProSearchEnabled: store.isProSearchEnabled,
      selectedLanguageModel: store.selectedLanguageModel,
    }),
    (
      { isProSearchEnabled, selectedLanguageModel },
      {
        isProSearchEnabled: previousIsProSearchEnabled,
        selectedLanguageModel: previousSelectedLanguageModel,
      },
    ) => {
      const isReasoningModel = isReasoningLanguageModelCode(
        selectedLanguageModel,
      );

      if (
        !isReasoningModel &&
        previousSelectedLanguageModel !== selectedLanguageModel
      ) {
        PplxApiService.setDefaultLanguageModel(selectedLanguageModel);
      }

      const { data: searchModels } = PplxCookieSearchModelsSchema.safeParse(
        jsonUtils.safeParse(getCookie("pplx.search-models-raw") ?? ""),
      );

      const searchModelsCookie =
        searchModels ??
        ({
          pro: "turbo",
          reasoning: "",
        } as PplxCookieSearchModels);

      let searchMode: PplxCookieSearchModes;

      if (isReasoningModel) {
        searchMode =
          selectedLanguageModel === "pplx_alpha" ? "deepResearch" : "reasoning";
        if (selectedLanguageModel !== "pplx_alpha") {
          searchModelsCookie.reasoning = selectedLanguageModel;
        }
      } else {
        searchMode =
          !isProSearchEnabled || selectedLanguageModel === "turbo"
            ? "auto"
            : "pro";

        searchModelsCookie.pro = selectedLanguageModel;
      }

      setCookie(
        "pplx.search-mode",
        searchMode satisfies PplxCookieSearchModes,
        30,
      );
      setCookie(
        "pplx.search-models-raw",
        JSON.stringify(searchModelsCookie satisfies PplxCookieSearchModels),
        30,
      );

      // Enable pro search if using reasoning model but pro search is disabled
      if (isReasoningModel && !previousIsProSearchEnabled) {
        sharedQueryBoxStore.setState({
          isProSearchEnabled: true,
        });
        return;
      }

      // Reset to standard model if pro search get disabled while a reasoning model is selected
      if (isReasoningModel && !isProSearchEnabled) {
        const defaultLanguageModel =
          searchModels?.pro ?? fastLanguageModels[0]?.code ?? "turbo";

        setCookie(
          "pplx.search-mode",
          "auto" satisfies PplxCookieSearchModes,
          30,
        );

        searchMode = "auto";

        sharedQueryBoxStore.setState((store) => {
          store.selectedLanguageModel = isLanguageModelCode(
            defaultLanguageModel,
          )
            ? defaultLanguageModel
            : "turbo";
        });
        return;
      }

      sendMessage(
        "reactVdom:syncNativeModelSelector",
        { searchMode },
        "window",
      );
    },
  );
}

export function populateDefaults() {
  const searchMode = getCookie("pplx.search-mode") as PplxCookieSearchModes;
  const { data: searchModels } = PplxCookieSearchModelsSchema.safeParse(
    jsonUtils.safeParse(getCookie("pplx.search-models-raw") ?? ""),
  );

  switch (searchMode) {
    case "auto":
      sharedQueryBoxStore.setState((draft) => {
        draft.selectedLanguageModel = searchModels?.pro ?? "turbo";
      });

      break;
    case "pro":
      sharedQueryBoxStore.setState((draft) => {
        draft.selectedLanguageModel = searchModels?.pro ?? "turbo";
        draft.isProSearchEnabled = true;
      });

      break;
    case "reasoning":
      sharedQueryBoxStore.setState((draft) => {
        draft.selectedLanguageModel =
          searchModels?.reasoning ??
          reasoningLanguageModels[0]?.code ??
          "turbo";
        draft.isProSearchEnabled = true;
      });

      break;
    case "deepResearch":
      sharedQueryBoxStore.setState((draft) => {
        draft.selectedLanguageModel = "pplx_alpha";
        draft.isProSearchEnabled = true;
      });

      break;
    default:
      sharedQueryBoxStore.setState((draft) => {
        draft.isProSearchEnabled = true;
      });
  }
}
