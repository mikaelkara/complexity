import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

export function toggleZenMode(forceState?: boolean): boolean {
  const previousZenMode = $("body").attr("data-cplx-zen-mode");
  const newZenMode =
    forceState !== undefined
      ? forceState
        ? "true"
        : "false"
      : previousZenMode === "true"
        ? "false"
        : "true";

  $("body").attr("data-cplx-zen-mode", newZenMode);

  if (
    ExtensionLocalStorageService.getCachedSync()?.plugins["zenMode"].persistent
  ) {
    ExtensionLocalStorageService.set((draft) => {
      draft.plugins["zenMode"].lastState = newZenMode === "true";
    });
  }

  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 300);

  return newZenMode === "true";
}
