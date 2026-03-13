import { DeployMethod } from "../components/DeployMethod";
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
};

export const VIEW_ORDER: ViewOrder = ["splash", "deployMethod"];
