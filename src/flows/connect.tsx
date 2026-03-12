import { DeployMethod } from "../components/DeployMethod";
import { Splash } from "../components/Splash";
import type { ViewLabelMap, ViewMap, ViewOrder } from "../types";

export const VIEW_MAP: ViewMap = {
  splash: Splash,
  deployMethod: DeployMethod,
  collector: () => <div>this is the collector step</div>,
};

export const VIEW_LABEL_MAP: ViewLabelMap = {
  deployMethod: "Deploy to your Argo CD server",
  collector: "Prepare your collector",
};

export const VIEW_ORDER: ViewOrder = ["splash", "deployMethod", "collector"];
