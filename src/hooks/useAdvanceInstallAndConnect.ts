import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { useCallback } from "react";
import { useLocation, useRoute, type DefaultParams } from "wouter";
import { ROUTES } from "../constants/routing";

export function useAdvanceInstallAndConnect() {
  const [, params] = useRoute<DefaultParams>(ROUTES.INSTALL_STEP);
  const [, navigate] = useLocation();
  const currentStepNumber = parseInt(params?.step ?? "0");
  const setFormField = useInstallAndConnectStore((state) => state.setFormField);
  const lastCompletedStep = useInstallAndConnectStore(
    (state) => state.lastCompletedStep,
  );

  const advanceInstallAndConnectFlow = useCallback(() => {
    if (currentStepNumber > lastCompletedStep || !lastCompletedStep) {
      setFormField("lastCompletedStep", currentStepNumber);
    }
    navigate(`${ROUTES.INSTALL}/${currentStepNumber + 1}`);
  }, [currentStepNumber, navigate, setFormField, lastCompletedStep]);

  return advanceInstallAndConnectFlow;
}
