import type { ClarityStore } from "@store/clarity/store";
import { createContext } from "react";

export const ClarityContext = createContext<ClarityStore | null>(null);
