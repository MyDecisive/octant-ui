import { DeployMethod } from "../components/DeployMethod";
import { PlaceholderViewStep } from "../components/PlaceholderViewStep";
import { Splash } from "../components/Splash";
import type { ViewMap, ViewOrder } from "../types";

export const VIEW_MAP: ViewMap = {
  splash: {
    Component: Splash,
  },
  deployMethod: {
    Component: DeployMethod,
    label: "Deploy to your Argo CD server",
  },
  collector: {
    Component: PlaceholderViewStep,
    label: "Prepare your collector",
  },
};

export const VIEW_ORDER: ViewOrder = ["splash", "deployMethod", "collector"];
