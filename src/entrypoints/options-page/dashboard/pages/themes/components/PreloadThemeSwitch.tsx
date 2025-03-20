import { LuCircleHelp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { InlineCode } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";
import { useExtensionPermissions } from "@/services/extension-permissions/useExtensionPermissions";

export default function PreloadThemeSwitch() {
  const { settings, mutation } = useExtensionLocalStorage();

  const {
    query: { data: grandtedPermissions },
    handleGrantPermission,
  } = useExtensionPermissions();

  const hasPermissions =
    grandtedPermissions?.permissions?.includes("scripting") &&
    grandtedPermissions?.permissions?.includes("webNavigation");

  if (!settings) return null;

  return (
    <div className="x:flex x:items-center x:gap-2 x:md:ml-auto">
      <Switch
        className="x:flex-col x:gap-2 x:md:flex-row x:md:gap-0"
        textLabel="Preload theme for a better experience"
        disabled={!hasPermissions}
        checked={settings.preloadTheme}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => (draft.preloadTheme = checked));
        }}
      />
      <div className="x:text-sm x:text-muted-foreground">
        <Tooltip
          content={
            <div className="x:p-2 x:text-balance">
              Instead of inserting <InlineCode>&lt;style&gt;</InlineCode> tags,
              Complexity uses <InlineCode>scripting</InlineCode> and{" "}
              <InlineCode>webNavigation</InlineCode> permissions to inject
              styles before the page loads. This results in a smooth,
              flicker-free experience. Complexity{" "}
              <span className="x:font-semibold x:underline">ONLY</span> uses
              these permissions for theme injection - it never tracks your
              browsing history or collects any personal data. Please review the
              source code if you have further questions.
            </div>
          }
        >
          <LuCircleHelp className="x:size-4" />
        </Tooltip>
      </div>
      {!hasPermissions && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Grant Permissions</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grant Permissions</DialogTitle>
            </DialogHeader>
            <div>
              You&apos;ll be asked to grant the extension both{" "}
              <InlineCode>scripting</InlineCode> and{" "}
              <InlineCode>webNavigation</InlineCode> permissions. While the
              permission prompt mentions access to browsing history, we want to
              assure you that we{" "}
              <span className="x:font-semibold x:text-primary x:underline">
                NEVER
              </span>{" "}
              read or store any of your history data - these permissions are
              only used for theme injection.
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  handleGrantPermission({
                    permissions: ["scripting", "webNavigation"],
                  });
                  mutation.mutate((draft) => (draft.preloadTheme = true));
                }}
              >
                Grant Permissions
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
