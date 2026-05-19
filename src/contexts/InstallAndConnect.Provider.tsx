import {
  createInstallAndConnectStore,
  type InstallAndConnectFormFields,
} from "@store/installAndConnectStore";
import { useOctantStore } from "@store/octantStore";
import { type PropsWithChildren, useState } from "react";
import { useShallow } from "zustand/shallow";
import { InstallAndConnectContext } from "./InstallAndConnect";

export function InstallAndConnectProvider({
  children,
  ...props
}: PropsWithChildren<Partial<InstallAndConnectFormFields>>) {
  const { connectionName, namespace } = useOctantStore(
    useShallow(({ connectionName, namespace }) => ({
      connectionName,
      namespace,
    })),
  );
  const [store] = useState(() =>
    createInstallAndConnectStore({ ...props, connectionName, namespace }),
  );

  return (
    <InstallAndConnectContext value={store}>
      {children}
    </InstallAndConnectContext>
  );
}
