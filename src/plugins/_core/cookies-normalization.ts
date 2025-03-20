import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { getCookie, setCookie } from "@/utils/utils";

csLoaderRegistry.register({
  id: "plugin:cookiesNormalization",
  loader: () => {
    handleDeepResearchTooltipImpressions();

    handleUnifiedEngineTooltip();
  },
});

function handleDeepResearchTooltipImpressions() {
  const pplxDeepResearchTooltipImpression = getCookie(
    "pplx.deep-research-tooltip-impressions",
  );

  if (
    pplxDeepResearchTooltipImpression == null ||
    Number(pplxDeepResearchTooltipImpression) < 10
  ) {
    setCookie("pplx.deep-research-tooltip-impressions", "999", 365);
  }
}

function handleUnifiedEngineTooltip() {
  const pplxUnifiedEngineTooltip = getCookie(
    "pplx.unified-engine-tooltip-shown",
  );

  if (pplxUnifiedEngineTooltip !== "true") {
    setCookie("pplx.unified-engine-tooltip-shown", "true", 365);
  }
}
