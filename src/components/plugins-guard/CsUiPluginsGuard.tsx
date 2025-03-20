import { Suspense } from "react";

import { APP_CONFIG } from "@/app.config";
import CopyButton from "@/components/CopyButton";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  type GuardConditions,
  type AdditionalCheckParams,
  type AdditionalCheckFn,
  checkDeviceType,
  checkAuthStatus,
  checkAccountTypes,
  checkPluginDependencies,
  checkIncognito,
  checkLocation,
  checkBrowser,
} from "@/components/plugins-guard/guards";
import { usePluginGuardsStore } from "@/components/plugins-guard/store";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Ul } from "@/components/ui/typography";
import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import usePplxIncognitoMode from "@/hooks/usePplxIncognitoMode";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { whereAmI } from "@/utils/utils";

type CsUiPluginsGuardProps = GuardConditions & {
  children: React.ReactNode;
  additionalCheck?: AdditionalCheckFn;
  onNotSatisfiedAllConditions?: () => void;
  fallback?: React.ReactNode;
};

function CsUiPluginsGuardError({
  dependentPluginIds,
  location,
  errorMessage,
}: Omit<CsUiPluginsGuardProps, "children"> & { errorMessage?: string }) {
  const traces = useErrorTraces({ errorMessage, location, dependentPluginIds });
  const pluginsError = usePluginsError(dependentPluginIds);

  return (
    <Dialog defaultOpen open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complexity encountered an error</DialogTitle>
          <DialogDescription>
            {dependentPluginIds?.length != null &&
              dependentPluginIds?.length > 0 &&
              pluginsError}
            {traces}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function useGuardConditions(props: CsUiPluginsGuardProps) {
  const { currentLocation, hasActiveSub, isLoggedIn, isMobile, isOrgMember } =
    usePluginGuardsStore();

  const pluginsEnableStates = PluginsStatesService.getEnableStatesCachedSync();
  const isIncognito = usePplxIncognitoMode();

  const deviceValid = checkDeviceType(props, { isMobile });
  const authValid = checkAuthStatus(props, { isLoggedIn });
  const accountValid = checkAccountTypes(props, { hasActiveSub, isOrgMember });
  const dependenciesValid = checkPluginDependencies(props, {
    pluginsEnableStates,
  });
  const locationValid = checkLocation(props, {
    currentLocation,
  });
  const incognitoValid = checkIncognito(props, { isIncognito });
  const browserValid = checkBrowser(props);

  return {
    deviceValid,
    authValid,
    accountValid,
    dependenciesValid,
    locationValid,
    incognitoValid,
    browserValid,
    pluginsEnableStates,
  };
}

export default function CsUiPluginsGuard(props: CsUiPluginsGuardProps) {
  const {
    deviceValid,
    authValid,
    accountValid,
    dependenciesValid,
    locationValid,
    incognitoValid,
    browserValid,
    pluginsEnableStates,
  } = useGuardConditions(props);

  const settings = ExtensionLocalStorageService.getCachedSync();
  const additionalCheckParams: AdditionalCheckParams = {
    ...props,
    pluginsEnableStates,
    settings,
  };
  const additionalCheckValid =
    props.additionalCheck?.(additionalCheckParams) ?? true;

  const allConditionsMet = [
    deviceValid,
    authValid,
    accountValid,
    dependenciesValid,
    locationValid,
    incognitoValid,
    browserValid,
    additionalCheckValid,
  ].every(Boolean);

  if (!allConditionsMet) {
    props.onNotSatisfiedAllConditions?.();
    return props.fallback;
  }

  return (
    <ErrorBoundary
      fallback={({ error }: { error: Error }) => (
        <CsUiPluginsGuardError {...props} errorMessage={error.message} />
      )}
    >
      <Suspense fallback={null}>{props.children}</Suspense>
    </ErrorBoundary>
  );
}

function useErrorTraces({
  errorMessage,
  location,
  dependentPluginIds,
}: {
  errorMessage?: string;
  location?: ReturnType<typeof whereAmI>[];
  dependentPluginIds?: GuardConditions["dependentPluginIds"];
}) {
  const tracesAsString = JSON.stringify(
    {
      errorMessage,
      browser: APP_CONFIG.BROWSER,
      version: APP_CONFIG.VERSION,
      location,
      dependentPluginIds,
      currentUrl: window.location.href,
      settings: ExtensionLocalStorageService.getCachedSync(),
      pluginsStates: PluginsStatesService.getEnableStatesCachedSync(),
    },
    null,
    4,
  );

  return (
    <div className="x:flex x:flex-col">
      <div>Please provide these details to the maintainer:</div>
      <div className="x:relative x:my-4 x:max-h-[300px] x:overflow-auto x:rounded-md x:bg-secondary x:p-2 x:font-mono">
        <CopyButton
          className="x:sticky x:top-2 x:right-2 x:float-right"
          content={tracesAsString}
        />
        <DebugInfoList traces={JSON.parse(tracesAsString)} />
      </div>
    </div>
  );
}

function usePluginsError(
  dependentPluginIds?: GuardConditions["dependentPluginIds"],
) {
  return dependentPluginIds?.length != null ? (
    <div>
      Error occurred in dependent plugins:
      <Ul>
        {dependentPluginIds.map((pluginId) => (
          <li key={pluginId} className="x:text-foreground">
            {PLUGINS_METADATA[pluginId]?.title || pluginId}
          </li>
        ))}
      </Ul>
      <div>Disable these plugins if errors persist.</div>
    </div>
  ) : null;
}

function DebugInfoList({ traces }: { traces: Record<string, unknown> }) {
  return (
    <Ul>
      {Object.entries(traces).map(([key, value]) => (
        <li key={key}>
          {key}: {typeof value === "string" ? value : JSON.stringify(value)}
        </li>
      ))}
    </Ul>
  );
}
