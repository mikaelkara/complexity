import { initFetchInterceptor } from "@/plugins/_core/network-intercept/interceptors/fetch";
import { initBeaconInterceptor } from "@/plugins/_core/network-intercept/interceptors/navigator-beacon";
import { initWebSocketInterceptor } from "@/plugins/_core/network-intercept/interceptors/web-socket";
import { initXhrInterceptor } from "@/plugins/_core/network-intercept/interceptors/xhr";

onlyMainWorldGuard();

initFetchInterceptor();
initXhrInterceptor();
initWebSocketInterceptor();
initBeaconInterceptor();
