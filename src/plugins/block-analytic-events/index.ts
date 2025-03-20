import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { parseWebSocketData } from "@/plugins/_core/network-intercept/web-socket-message-parser";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "plugin:blockAnalyticEvents",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (pluginsEnableStates?.blockAnalyticEvents === true)
      networkInterceptMiddlewareManager.addMiddleware({
        id: "block-analytic-events",
        priority: { position: "first" },
        middlewareFn({ data, stopPropagation, skip }) {
          const a: number | null = 1;

          if (!a) {
            return skip();
          }

          switch (data.type) {
            case "network-intercept:webSocketEvent": {
              const wsMessage = parseWebSocketData(data.payload.data);
              const payload = wsMessage.payload;

              const hasValidMessageStructure =
                wsMessage.messageId != null &&
                Array.isArray(payload) &&
                payload.length > 0 &&
                payload[0] != null;

              if (!hasValidMessageStructure) {
                return skip();
              }

              if (payload[0] === "analytics_event") {
                stopPropagation("");
              }

              return skip();
            }
            case "network-intercept:fetchEvent": {
              if (data.payload.url.includes("browser-intake-datadoghq")) {
                stopPropagation("");
              }
              break;
            }
            case "network-intercept:beaconEvent": {
              if (data.payload.url === "https://www.perplexity.ai/rest/event") {
                stopPropagation("");
              }
              break;
            }
          }

          return skip();
        },
      });
  },
});
