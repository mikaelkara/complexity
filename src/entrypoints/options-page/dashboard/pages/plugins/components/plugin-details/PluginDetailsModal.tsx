import { DialogOpenChangeDetails } from "@ark-ui/react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import { PLUGIN_DETAILS } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-details/plugins-details";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

type PluginDetailsModalProps = {
  pluginId: PluginId;
};

export default function PluginDetailsModal({
  pluginId,
}: PluginDetailsModalProps) {
  const navigate = useNavigate();
  const { isMobile } = useIsMobileStore();

  const handleClose = ({ open }: DialogOpenChangeDetails) => {
    if (!open) {
      navigate("/plugins");
    }
  };

  const DialogComp = isMobile ? Sheet : Dialog;
  const DialogContentComp = isMobile ? SheetContent : DialogContent;

  return (
    <DialogComp open onOpenChange={handleClose}>
      <DialogContentComp
        className="x:md:max-w-max"
        side={isMobile ? "bottom" : undefined}
      >
        <DialogHeader>
          <DialogTitle>{PLUGINS_METADATA[pluginId].title}</DialogTitle>
          <DialogDescription className="x:whitespace-pre-line">
            {PLUGINS_METADATA[pluginId].description}
          </DialogDescription>
        </DialogHeader>
        <div className="x:mt-4">{PLUGIN_DETAILS[pluginId]}</div>
      </DialogContentComp>
    </DialogComp>
  );
}
