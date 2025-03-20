import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import {
  handleSearchModeChange,
  populateDefaults,
} from "@/plugins/_core/ui-groups/query-box/utils";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

type SharedQueryBoxStore = {
  isProSearchEnabled: boolean;
  setIsProSearchEnabled: (isProSearchEnabled: boolean) => void;
  selectedLanguageModel: LanguageModel["code"];
  setSelectedLanguageModel: (
    selectedLanguageModel: LanguageModel["code"],
  ) => void;
};

const useSharedQueryBoxStore = createWithEqualityFn<SharedQueryBoxStore>()(
  subscribeWithSelector(
    immer(
      (set): SharedQueryBoxStore => ({
        isProSearchEnabled: false,
        setIsProSearchEnabled: async (isProSearchEnabled) => {
          set({ isProSearchEnabled });
        },
        selectedLanguageModel: "turbo",
        setSelectedLanguageModel: async (selectedLanguageModel) => {
          set({ selectedLanguageModel });
        },
      }),
    ),
  ),
);

const sharedQueryBoxStore = useSharedQueryBoxStore;

csLoaderRegistry.register({
  id: "plugin:queryBox:initSharedStore",
  dependencies: ["messaging:namespaceSetup", "cache:pluginsStates"],
  loader: async () => {
    populateDefaults();
    handleSearchModeChange();
  },
});

export { sharedQueryBoxStore, useSharedQueryBoxStore };
