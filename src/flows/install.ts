import type { ViewMap, ViewOrder } from "@types";
import { ArgoInstall } from "./install/ArgoInstall";
import { ConnectToCluster } from "./install/ConnectToCluster";
import { DeployCollector } from "./install/DeployCollector";
import { NextSteps } from "./install/NextSteps";
import { SetupSmarthub } from "./install/SetupSmarthub";
import { UpdateAgent } from "./install/UpdateAgent";
import { VerifyConnection } from "./install/VerifyConnection";

export const VIEW_MAP: ViewMap = {
  argoInstall: {
    Component: ArgoInstall,
    label: "Install via ArgoCD",
  },
  connectToCluster: {
    Component: ConnectToCluster,
    label: "Connect to your Kubernetes cluster",
  },
  setupSmarthub: {
    Component: SetupSmarthub,
    label: "Set up and install your Smarthub",
  },
  deployCollector: {
    Component: DeployCollector,
    label: "Prepare and deploy collector",
  },
  updateAgent: {
    Component: UpdateAgent,
    label: "Update Datadog agent and test",
  },
  nextSteps: {
    Component: NextSteps,
    label: "Next steps",
  },
  verifyConnection: {
    Component: VerifyConnection,
    label: "Verify connection and data",
  },
};

export const VIEW_ORDER: ViewOrder = [
  "argoInstall",
  "connectToCluster",
  "setupSmarthub",
  "deployCollector",
  "updateAgent",
  "verifyConnection",
  "nextSteps",
];
