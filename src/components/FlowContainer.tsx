import { useOctantConnectStore } from "@store";
import { VIEW_MAP, VIEW_ORDER } from "../flows/install";
import { StepperNav } from "./StepperNav";

const flowStepKeys = VIEW_ORDER.filter((step) => VIEW_MAP[step].label);
const flowSteps = flowStepKeys.map((key) => ({
  title: VIEW_MAP[key].label,
  id: key,
}));

export function FlowContainer() {
  const activeView = useOctantConnectStore((state) => state.activeView);
  const setActiveView = useOctantConnectStore((state) => state.setActiveView);

  const { Component } = VIEW_MAP[activeView];

  const activeStepIndex = flowStepKeys.indexOf(activeView);

  return (
    <>
      <StepperNav
        activeStepIndex={activeStepIndex}
        steps={flowSteps}
        onStepClick={setActiveView}
      />
      <Component />
    </>
  );
}
