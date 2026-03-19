import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useCallback } from "react";
import { VIEW_MAP, VIEW_ORDER } from "../flows/connect";
import { useOctantConnectStore } from "../store/store";
import "./FlowContainer.css";
import { Nav } from "./Nav";

const flowStepKeys = VIEW_ORDER.filter((step) => VIEW_MAP[step].label);
const flowSteps = flowStepKeys.map((key) => ({
  title: VIEW_MAP[key].label!,
  id: key,
}));

export function FlowContainer() {
  const activeView = useOctantConnectStore((state) => state.activeView);
  const setActiveView = useOctantConnectStore((state) => state.setActiveView);

  const onClickProgress = useCallback(() => {
    const currentViewIdx = VIEW_ORDER.indexOf(activeView);
    setActiveView(VIEW_ORDER[currentViewIdx + 1]);
  }, [activeView, setActiveView]);

  const { Component, label } = VIEW_MAP[activeView];

  const activeStepIndex = flowStepKeys.indexOf(activeView);

  return (
    <Box className="flow-container-box">
      <Paper
        className={`flow-container-paper${!label ? " splash" : ""}`}
        elevation={0}
      >
        {label && (
          <Nav
            activeStepIndex={activeStepIndex}
            steps={flowSteps}
            onStepClick={setActiveView}
          />
        )}
        <Component viewKey={activeView} onClickProgress={onClickProgress} />
      </Paper>
    </Box>
  );
}
