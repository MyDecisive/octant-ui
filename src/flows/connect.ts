import type { ViewMap, ViewOrder } from "@types";
import { DataFidelity } from "./connect/DataFidelity";
import { DeployMethod } from "./connect/DeployMethod";
import { ExecuteDeploy } from "./connect/ExecuteDeploy";
import { ForwardData } from "./connect/ForwardData";
import { NextSteps } from "./connect/NextSteps";
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
  dataFidelity: {
    Component: DataFidelity,
    label: "Verify connection and data",
  },
  nextSteps: {
    Component: NextSteps,
    label: "Next steps",
  },
  executeDeploy: {
    Component: ExecuteDeploy,
    label: "Select deployment method",
  },
};

export const VIEW_ORDER: ViewOrder = [
  "splash",
  "deployMethod",
  "prepareCollector",
  "executeDeploy",
  "forwardData",
  "dataFidelity",
  "nextSteps",
];
