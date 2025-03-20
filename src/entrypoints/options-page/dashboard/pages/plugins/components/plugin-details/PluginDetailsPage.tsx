import { LuChevronLeft } from "react-icons/lu";
import { Link } from "react-router-dom";

import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import { PLUGIN_DETAILS } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-details/plugins-details";

type PluginDetailsPageProps = {
  pluginRouteSegment: string;
};

export default function PluginDetailsPage({
  pluginRouteSegment,
}: PluginDetailsPageProps) {
  const plugin = Object.values(PLUGINS_METADATA).find(
    (plugin) => plugin.routeSegment === pluginRouteSegment,
  );

  const dialogContent = plugin ? PLUGIN_DETAILS[plugin.id] : null;

  if (!plugin) return null;

  return (
    <div className="x:space-y-6">
      <Link
        to="/plugins"
        className="x:mb-4 x:flex x:items-center x:gap-2 x:text-muted-foreground x:transition x:hover:text-foreground"
      >
        <LuChevronLeft />
        Back to plugins
      </Link>
      <div>
        <h1 className="x:text-2xl x:font-bold">{plugin.title}</h1>
        <p className="x:mt-2 x:text-muted-foreground">{plugin.description}</p>
      </div>
      {dialogContent}
    </div>
  );
}
