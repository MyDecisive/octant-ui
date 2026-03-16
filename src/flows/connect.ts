import { DeployMethod } from "../components/connectFlow/DeployMethod";
import { PrepareCollector } from "../components/connectFlow/PrepareCollector";
import { Splash } from "../components/connectFlow/Splash";
import type { ViewMap, ViewOrder } from "../types";

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
};

export const VIEW_ORDER: ViewOrder = [
  "splash",
  "deployMethod",
  "prepareCollector",
];
