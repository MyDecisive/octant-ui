import { ViewPlaceholder } from "@components/ViewPlaceholder";
import type { ViewMap, ViewOrder } from "@types";
import { ArgoInstall } from "./install/ArgoInstall";
import { ConnectToCluster } from "./install/ConnectToCluster";
import { SetupSmarthub } from "./install/SetupSmarthub";

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
  prepare: {
    Component: ViewPlaceholder,
    label: "Prepare and deploy collector",
  },
  update: {
    Component: ViewPlaceholder,
    label: "Update Datadog agent and test",
  },
  next: {
    Component: ViewPlaceholder,
    label: "Next steps",
  },
};

export const VIEW_ORDER: ViewOrder = [
  "argoInstall",
  "connectToCluster",
  "setupSmarthub",
  "prepare",
  "update",
  "next",
];
