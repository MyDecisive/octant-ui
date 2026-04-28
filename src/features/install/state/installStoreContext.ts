import { createContext } from "react";

import { createInstallStore } from "./createInstallStore";

export type InstallStore = ReturnType<typeof createInstallStore>;

export const InstallStoreContext = createContext<InstallStore | null>(null);
