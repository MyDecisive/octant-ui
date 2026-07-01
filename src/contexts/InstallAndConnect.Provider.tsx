import { useHubInstallStore } from "@store/hubInstallStore";
import {
  createInstallAndConnectStore,
  type InstallAndConnectFormFields,
} from "@store/installAndConnectStore";
import { useOctantStore } from "@store/octantStore";
import { fromMLTTypes } from "@utils/fromMltTypes";
import {
  createIxCDemoValues,
  isDemo,
} from "@utils/initialization/useDemoValues";
import { type PropsWithChildren, useState } from "react";
import { useShallow } from "zustand/shallow";
import { InstallAndConnectContext } from "./InstallAndConnect";

export function InstallAndConnectProvider({
  children,
  ...props
}: PropsWithChildren<Partial<InstallAndConnectFormFields>>) {
  const { connectionName, namespace, telemetryTypes } = useOctantStore(
    useShallow(({ connection }) => ({
      connectionName: connection?.scope?.connectionName,
      namespace: connection?.scope?.namespace,
      telemetryTypes: connection?.telemetryTypes,
    })),
  );
  const hubInstalled = useHubInstallStore((state) => state.installed);
  const [store] = useState(() => {
    if (isDemo) {
      return createInstallAndConnectStore({
        ...props,
        ...createIxCDemoValues(),
        lastCompletedStep: -1,
      });
    }

    return createInstallAndConnectStore({
      ...props,
      ...(connectionName ? { connectionName } : {}),
      ...(namespace ? { namespace } : {}),
      ...(telemetryTypes?.length
        ? { telemetryTypes: fromMLTTypes(telemetryTypes) }
        : {}),
      ...(hubInstalled ? { lastCompletedStep: 3 } : {}),
    });
  });

  return (
    <InstallAndConnectContext value={store}>
      {children}
    </InstallAndConnectContext>
  );
}
