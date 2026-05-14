import { ArgoInstall } from "../flows/install/ArgoInstall";
import { ConnectToCluster } from "../flows/install/ConnectToCluster";
import { DeployCollector } from "../flows/install/DeployCollector";
import { NextSteps } from "../flows/install/NextSteps";
import { SetupSmarthub } from "../flows/install/SetupSmarthub";
import { UpdateAgent } from "../flows/install/UpdateAgent";
import { VerifyConnection } from "../flows/install/VerifyConnection";

export const ROUTES = {
  SPLASH: "/",
  INSTALL: "/install",
  INSTALL_STEP: "/install/:step",
  CLARITY: "/clarity",
  SYSTEMHEALTH: "/system-health",
  SETTINGS: "/settings",
  SUPPORT: "/support",
};

export const FLOW_ROUTES = new RegExp(/^\/(?:install(?:\/\d+)?)?$/);

export const PAGE_ROUTES = new RegExp(/^\/(clarity|connections|smarthub)$/);

export const INSTALL_AND_CONNECT = [
  {
    Component: ArgoInstall,
    label: "Install via ArgoCD",
  },
  {
    Component: ConnectToCluster,
    label: "Connect to your Kubernetes cluster",
  },
  {
    Component: SetupSmarthub,
    label: "Set up and install your Smarthub",
  },
  {
    Component: DeployCollector,
    label: "Prepare and deploy collector",
  },
  {
    Component: UpdateAgent,
    label: "Update Datadog agent and test",
  },
  {
    Component: VerifyConnection,
    label: "Verify connection and data",
  },
  {
    Component: NextSteps,
    label: "Next steps",
  },
];
