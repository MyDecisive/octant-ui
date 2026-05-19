import type { InstallAndConnectStore } from "@store/installAndConnectStore";
import { createContext } from "react";

export const InstallAndConnectContext =
  createContext<InstallAndConnectStore | null>(null);
