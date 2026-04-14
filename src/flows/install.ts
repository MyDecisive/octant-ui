import { ViewPlaceholder } from "@components/ViewPlaceholder";
import type { ViewMap, ViewOrder } from "@types";

export const VIEW_MAP: ViewMap = {
  install: {
    Component: ViewPlaceholder,
    label: "Install via ArgoCD",
  },
  connect: {
    Component: ViewPlaceholder,
    label: "Connect to your Kubernetes cluster",
  },
  setup: {
    Component: ViewPlaceholder,
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
  "install",
  "connect",
  "setup",
  "prepare",
  "update",
  "next",
];
