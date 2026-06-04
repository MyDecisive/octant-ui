import { createClarityStore } from "@store/clarityStore";
import { useOctantStore } from "@store/octantStore";
import { type PropsWithChildren, useState } from "react";
import { useShallow } from "zustand/shallow";
import { ClarityContainer } from "../pages/Clarity/ClarityContainer";
import { ClarityContext } from "./Clarity";

export function ClarityProvider({ children }: PropsWithChildren) {
  const { connectionScope } = useOctantStore(
    useShallow(({ connection }) => ({
      connectionScope: connection?.scope,
    })),
  );

  const [store] = useState(() => createClarityStore({ connectionScope }));

  return (
    <ClarityContext value={store}>
      <ClarityContainer>{children}</ClarityContainer>
    </ClarityContext>
  );
}
