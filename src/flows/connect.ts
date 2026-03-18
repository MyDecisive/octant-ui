import type { ViewMap, ViewOrder } from "../types";
import { DeployMethod } from "./connect/DeployMethod";
import { ForwardData } from "./connect/ForwardData";
import { PrepareCollector } from "./connect/PrepareCollector";
import { Splash } from "./connect/Splash";

export const VIEW_MAP: ViewMap = {
  splash: {
    Component: Splash,
  },
  deployMethod: {
    Component: DeployMethod,
    label: "Deploy to your Argo CD server",
  },
  prepareCollector: {
    Component: PrepareCollector,
    label: "Prepare your collector",
  },
  forwardData: {
    Component: ForwardData,
    label: "Route Datadog Telemetry to OTel",
  },
};

export const VIEW_ORDER: ViewOrder = [
  "splash",
  "deployMethod",
  "prepareCollector",
  "forwardData",
];
