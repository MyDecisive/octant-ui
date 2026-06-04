import type { ClarityStore } from "@store/clarityStore";
import { createContext } from "react";

export const ClarityContext = createContext<ClarityStore | null>(null);
