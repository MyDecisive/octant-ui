import {
  createInstallAndConnectStore,
  type InstallAndConnectFormFields,
} from "@store/installAndConnectStore";
import { useHubInstallStore } from "@store/hubInstallStore";
import { useOctantStore } from "@store/octantStore";
import { fromMLTTypes } from "@utils/fromMltTypes";
import { type PropsWithChildren, useState } from "react";
import { useShallow } from "zustand/shallow";
import { InstallAndConnectContext } from "./InstallAndConnect";

export function InstallAndConnectProvider({
  children,
  ...props
}: PropsWithChildren<Partial<InstallAndConnectFormFields>>) {
  const {
    connectionName,
    namespace,
    telemetryTypes = [],
  } = useOctantStore(
    useShallow(({ connection }) => ({
      connectionName: connection?.scope?.connectionName,
      namespace: connection?.scope?.namespace,
      telemetryTypes: connection?.telemetryTypes,
    })),
  );
  const hubInstalled = useHubInstallStore((state) => state.installed);
  const [store] = useState(() =>
    createInstallAndConnectStore({
      ...props,
      connectionName,
      namespace,
      telemetryTypes: fromMLTTypes(telemetryTypes),
      lastCompletedStep: hubInstalled ? 3 : undefined,
    }),
  );

  return (
    <InstallAndConnectContext value={store}>
      {children}
    </InstallAndConnectContext>
  );
}
