import { useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { ROUTES } from "../constants/routing";

export function useAdvanceInstallAndConnect() {
  const [, params] = useParams<[boolean, { step: string }]>();
  const [, navigate] = useLocation();
  const currentStepNumber = parseInt(params.step);

  const advanceInstallAndConnectFlow = useCallback(() => {
    navigate(`${ROUTES.INSTALL}/${currentStepNumber + 1}`);
  }, [currentStepNumber, navigate]);

  return advanceInstallAndConnectFlow;
}
