import type { DeployMethod, TelemetryTypes, ViewKey } from "@types";
import { create } from "zustand";
import type { ArgoCdIntegrationBody, DatadogIntegrationBody } from "../services/api";

export interface AppStateForm {
  deployMethod: DeployMethod;
  argoUrl?: string;
  accountToken?: string;
  telemetryTypes: TelemetryTypes[];
  url?: string;
  apiKey?: string;
  connectionName?: string;
}
interface Values {
  activeView: ViewKey;
  form: AppStateForm;
}

interface Actions {
  setActiveView: (newView: ViewKey) => void;
  setFormField: (
    key: keyof AppStateForm,
    value: AppStateForm[keyof AppStateForm],
  ) => void;
  resetForm: () => void;
}

type OctantConnectStore = Values & Actions;

type LastIntegrationValues = {
  argocd?: ArgoCdIntegrationBody;
  datadog?: DatadogIntegrationBody;
}

function createDefaultOctantConnectForm(): AppStateForm {
  const lastIntegrationValuesStr = localStorage.getItem("octant-last-integrations") as string || undefined;
  let lastIntegrationValues: LastIntegrationValues = {}
  try {
    if (lastIntegrationValuesStr) {
      lastIntegrationValues = JSON.parse(lastIntegrationValuesStr) as LastIntegrationValues
    }
  } catch (err) {
    console.log(err)
  }

  return {
    deployMethod: "argocd-sideload",
    telemetryTypes: [],
    argoUrl: lastIntegrationValues?.argocd?.apiUrl,
    accountToken: lastIntegrationValues?.argocd?.accountToken,
    url: lastIntegrationValues?.datadog?.url,
    apiKey: lastIntegrationValues?.datadog?.apiKey,
  };
}

function createDefaultOctantConnectState() {
  return {
    activeView: "splash",
    form: createDefaultOctantConnectForm(),
  };
}

export const useOctantConnectStore = create<OctantConnectStore>()((set) => ({
  ...createDefaultOctantConnectState(),
  setActiveView: (newView) =>
    set((state) => ({ ...state, activeView: newView })),
  setFormField: (key, value) =>
    set((state) => ({ ...state, form: { ...state.form, [key]: value } })),
  resetForm: () =>
    set((state) => ({ ...state, form: createDefaultOctantConnectForm() })),
}));
