import { useContext } from "react";
import { useStore } from "zustand";

import type { InstallState } from "./createInstallStore";
import { InstallStoreContext } from "./installStoreContext";

export function useInstallStore<T>(selector: (state: InstallState) => T): T {
  const store = useContext(InstallStoreContext);

  if (!store) {
    throw new Error("useInstallStore must be used within InstallStoreProvider");
  }

  return useStore(store, selector);
}
