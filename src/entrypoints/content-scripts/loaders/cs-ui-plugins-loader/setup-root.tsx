import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { RouterProvider } from "react-router-dom";

import CsUiRoot from "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/CsUiRoot";
import { createRouter } from "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/router";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";

csLoaderRegistry.register({
  id: "csui:root",
  loader: async () => {
    const $root = $("<div>")
      .attr("id", "complexity-root")
      .appendTo(document.body);

    if ($root[0] == null) return;

    const root = createRoot($root[0]);
    const router = createRouter();

    root.render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <CsUiRoot />
          <RouterProvider router={router} />
        </I18nextProvider>
      </QueryClientProvider>,
    );
  },
  dependencies: [
    "lib:i18next",
    "lib:dayjs",
    "cache:pluginsStates",
    "cache:languageModels",
    "cache:extensionLocalStorage",
    "cache:betterCodeBlocksFineGrainedOptions",
  ],
});
