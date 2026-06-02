import {
  createInstallAndConnectStore,
  type InstallAndConnectFormFields,
} from "@store/installAndConnectStore";
import { useOctantStore } from "@store/octantStore";
import { fromMLTTypes } from "@utils/fromMltTypes";
import { type PropsWithChildren, useState } from "react";
import { useShallow } from "zustand/shallow";
import { InstallAndConnectContext } from "./InstallAndConnect";

export function InstallAndConnectProvider({
  children,
  ...props
}: PropsWithChildren<Partial<InstallAndConnectFormFields>>) {
  const { connectionName, hubInstalled, namespace, telemetryTypes } =
    useOctantStore(
      useShallow(({ connection, hubInstalled }) => ({
        connectionName: connection?.scope?.connectionName,
        namespace: connection?.scope?.namespace,
        telemetryTypes: fromMLTTypes(connection?.telemetryTypes || []),
        hubInstalled,
      })),
    );
  const [store] = useState(() =>
    createInstallAndConnectStore({
      ...props,
      connectionName,
      namespace,
      telemetryTypes,
      lastCompletedStep: hubInstalled ? 3 : undefined,
    }),
  );

  return (
    <InstallAndConnectContext value={store}>
      {children}
    </InstallAndConnectContext>
  );
}
