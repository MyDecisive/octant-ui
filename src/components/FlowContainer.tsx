import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { useCallback } from "react";
import { VIEW_MAP, VIEW_ORDER } from "../flows/connect";
import { useOctantConnectStore } from "../store/store";
import { Nav } from "./Nav";

export function FlowContainer() {
  const activeView = useOctantConnectStore((state) => state.activeView);
  const setActiveView = useOctantConnectStore((state) => state.setActiveView);

  const onClickProgress = useCallback(() => {
    const currentViewIdx = VIEW_ORDER.indexOf(activeView);
    // This modulo is only here for local dev while the flow is being built out
    setActiveView(VIEW_ORDER[(currentViewIdx + 1) % VIEW_ORDER.length]);
  }, [activeView, setActiveView]);

  const { Component, label } = VIEW_MAP[activeView];

  if (label) {
    const flowStepKeys = VIEW_ORDER.filter((step) => VIEW_MAP[step].label);
    const flowSteps = flowStepKeys.map((key) => ({
      title: VIEW_MAP[key].label!,
      id: key,
    }));
    const activeStepIndex = flowStepKeys.indexOf(activeView);

    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, pb: 8, mt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            border: "1px solid #CFCFD4",
            backgroundColor: "background.paper",
            minHeight: 620,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "230px 1px 1fr" },
              gap: 3,
            }}
          >
            <Nav
              activeStepIndex={activeStepIndex}
              steps={flowSteps}
              onStepClick={setActiveView}
            />
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
                borderColor: "#D5D5DA",
              }}
            />

            <Component viewKey={activeView} onClickProgress={onClickProgress} />
          </Box>
        </Paper>
      </Box>
    );
  }

  return <Component viewKey={activeView} onClickProgress={onClickProgress} />;
}
