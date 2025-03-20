import type { BackgroundEvents as BackgroundEventHandlers } from "@/entrypoints/background/listeners";
import type { DispatchEvents as SpaRouterDispatchEventHandlers } from "@/plugins/_api/spa-router/listeners";
import type { CsUtilEvents as SpaRouterCsUtilEventHandlers } from "@/plugins/_api/spa-router/listeners.main-world";
import type { MarkmapRendererEvents as MarkmapRendererEventHandlers } from "@/plugins/_core/markmap-renderer/listeners";
import type { MermaidRendererEvents as MermaidRendererEventHandlers } from "@/plugins/_core/mermaid-renderer/listeners";
import type { InterceptorsEvents as NetworkInterceptInterceptorsEventHandlers } from "@/plugins/_core/network-intercept/listeners";
import type { ReactVdomEvents as ReactVdomEventHandlers } from "@/plugins/_core/react-vdom/listeners";

export type AllEventHandlers = BackgroundEventHandlers &
  NetworkInterceptInterceptorsEventHandlers &
  SpaRouterCsUtilEventHandlers &
  SpaRouterDispatchEventHandlers &
  ReactVdomEventHandlers &
  MermaidRendererEventHandlers &
  MarkmapRendererEventHandlers;
