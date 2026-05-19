import { ArgoInstall } from "../pages/ArgoInstall";
import { ConnectToCluster } from "../pages/ConnectToCluster";
import { DeployCollector } from "../pages/DeployCollector";
import { NextSteps } from "../pages/NextSteps/NextSteps";
import { SetupSmarthub } from "../pages/SetupSmarthub";
import { UpdateAgent } from "../pages/UpdateAgent/UpdateAgent";
import { VerifyConnection } from "../pages/VerifyConnection";

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

export const PAGE_ROUTES = new RegExp(
  /^\/(clarity|system-health|settings|support)$/,
);

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
