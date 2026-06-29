import { createClarityStore } from "@store/clarity/store";
import { useOctantStore } from "@store/octantStore";
import { type PropsWithChildren, useState } from "react";
import { useShallow } from "zustand/shallow";
import { ClarityContainer } from "../pages/Clarity/ClarityContainer";
import { ClarityContext } from "./Clarity";

export function ClarityProvider({ children }: PropsWithChildren) {
  const { connectionScope, configuredTelemetryTypes = [] } = useOctantStore(
    useShallow(({ connection }) => ({
      connectionScope: connection?.scope,
      configuredTelemetryTypes: connection?.telemetryTypes,
    })),
  );

  const [store] = useState(() =>
    createClarityStore({ connectionScope, configuredTelemetryTypes }),
  );

  return (
    <ClarityContext value={store}>
      <ClarityContainer>{children}</ClarityContainer>
    </ClarityContext>
  );
}
