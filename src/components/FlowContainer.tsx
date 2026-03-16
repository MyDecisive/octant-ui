import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useCallback, useMemo } from "react";
import { VIEW_MAP, VIEW_ORDER } from "../flows/connect";
import { useOctantConnectStore } from "../store/store";
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
    // This modulo is only here for local dev while the flow is being built out
    setActiveView(VIEW_ORDER[(currentViewIdx + 1) % VIEW_ORDER.length]);
  }, [activeView, setActiveView]);

  const { Component, label } = VIEW_MAP[activeView];

  const activeStepIndex = useMemo(() => {
    return flowStepKeys.indexOf(activeView);
  }, [activeView]);
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: 3,
        pb: 8,
        pt: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #CFCFD4",
          backgroundColor: "background.paper",
          minHeight: 620,
          py: 5,
          px: 3,
          ...(!label && {
            height: "100%",
            display: "flex",
            justifyContent: "stretch",
            alignItems: "stretch",
            p: 0,
          }),
        }}
      >
        {label ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "3fr 9fr",
              gap: 3,
            }}
          >
            <Nav
              activeStepIndex={activeStepIndex}
              steps={flowSteps}
              onStepClick={setActiveView}
            />

            <Component viewKey={activeView} onClickProgress={onClickProgress} />
          </Box>
        ) : (
          <Component viewKey={activeView} onClickProgress={onClickProgress} />
        )}
      </Paper>
    </Box>
  );
}
