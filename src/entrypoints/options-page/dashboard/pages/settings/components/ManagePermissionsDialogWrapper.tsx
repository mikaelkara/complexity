import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  TOGGLEABLE_PERMISSIONS,
  TOGGLEABLE_PERMISSIONS_DETAILS,
} from "@/data/extension-permissions";
import { useExtensionPermissions } from "@/services/extension-permissions/useExtensionPermissions";

export default function ManagePermissionsDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    query: { data: grandtedPermissions },
    handleGrantPermission,
    handleRevokePermission,
  } = useExtensionPermissions();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Grant or revoke extension permissions. Please note that some
            features may be disabled without the necessary permissions.
          </DialogDescription>
          {TOGGLEABLE_PERMISSIONS.length > 0 ? (
            TOGGLEABLE_PERMISSIONS.map((permission) => (
              <div
                key={permission}
                className="x:!mt-4 x:flex x:flex-col x:gap-2"
              >
                <Switch
                  className="x:items-start x:text-muted-foreground"
                  textLabel={
                    <div className="x:flex x:flex-col">
                      <div>
                        {TOGGLEABLE_PERMISSIONS_DETAILS[permission]?.title}
                      </div>
                      <div className="x:text-sm x:text-muted-foreground">
                        {
                          TOGGLEABLE_PERMISSIONS_DETAILS[permission]
                            ?.description
                        }
                      </div>
                    </div>
                  }
                  checked={grandtedPermissions?.permissions?.includes(
                    permission,
                  )}
                  onCheckedChange={() => {
                    if (
                      grandtedPermissions?.permissions?.includes(permission)
                    ) {
                      handleRevokePermission({ permissions: [permission] });
                    } else {
                      handleGrantPermission({ permissions: [permission] });
                    }
                  }}
                />
              </div>
            ))
          ) : (
            <div className="x:mx-auto x:block x:py-16 x:text-muted-foreground x:italic">
              You&apos;re all set!
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
