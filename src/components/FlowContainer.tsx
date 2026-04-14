import { useOctantConnectStore } from "@store";
import { useCallback } from "react";
import { VIEW_MAP, VIEW_ORDER } from "../flows/install";
import "./FlowContainer.css";
import { LeftColumn } from "./layout/LeftColumn";
import { Nav } from "./Nav";

const flowStepKeys = VIEW_ORDER.filter((step) => VIEW_MAP[step].label);
const flowSteps = flowStepKeys.map((key) => ({
  title: VIEW_MAP[key].label,
  id: key,
}));

export function FlowContainer() {
  const activeView = useOctantConnectStore((state) => state.activeView);
  const setActiveView = useOctantConnectStore((state) => state.setActiveView);

  const onClickProgress = useCallback(() => {
    const currentViewIdx = VIEW_ORDER.indexOf(activeView);
    setActiveView(VIEW_ORDER[currentViewIdx + 1]);
  }, [activeView, setActiveView]);

  const { Component } = VIEW_MAP[activeView];

  const activeStepIndex = flowStepKeys.indexOf(activeView);

  return (
    <>
      <LeftColumn>
        <Nav
          activeStepIndex={activeStepIndex}
          steps={flowSteps}
          onStepClick={setActiveView}
        />
      </LeftColumn>
      <Component viewKey={activeView} onClickProgress={onClickProgress} />
    </>
  );
}
