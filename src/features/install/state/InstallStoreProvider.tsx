import { useState, type ReactNode } from "react";

import { createInstallStore } from "./createInstallStore";
import { InstallStoreContext } from "./installStoreContext";

export function InstallStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createInstallStore);

  return (
    <InstallStoreContext.Provider value={store}>
      {children}
    </InstallStoreContext.Provider>
  );
}
