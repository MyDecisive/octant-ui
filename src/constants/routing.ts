import type { InstallAndConnectFormFields } from "@store/installAndConnectStore";
import { ArgoInstall } from "../pages/ArgoInstall";
import { ConnectToCluster } from "../pages/ConnectToCluster";
import { DeployCollector } from "../pages/DeployCollector";
import { NextSteps } from "../pages/NextSteps";
import { SetupSmarthub } from "../pages/SetupSmarthub";
import { UpdateAgent } from "../pages/UpdateAgent/UpdateAgent";
import { VerifyConnection } from "../pages/VerifyConnection";

export const ROUTES = {
  SPLASH: "/",
  INSTALL: "/install",
  INSTALL_STEP: "/install/:step",
  CLARITY: "/clarity",
  SYSTEMHEALTH: "/system-health",
  SETTINGS: "/settings",
  SUPPORT: "/support",
  ERROR: "/error",
};

export const FLOW_ROUTES = new RegExp(/^\/(?:install(?:\/[1-7])?)?$/);

export const PAGE_ROUTES = new RegExp(
  /^\/(clarity|system-health|settings|support)$/,
);

export const INSTALL_AND_CONNECT = [
  {
    Component: ArgoInstall,
    label: "Install via ArgoCD",
    isAvailable: () => {
      return true;
    },
    // restrictions: none
    // work: establish argoAgreement = true
  },
  {
    Component: ConnectToCluster,
    label: "Connect to your Kubernetes cluster",
    isAvailable: () => {
      return true;
    },
    /**
     * restrictions:
     *    if !argoAgreement in InstallAndConnectStore, show modal.
     */
    // work: saveArgoConnection; establish connectionName
  },
  {
    Component: SetupSmarthub,
    label: "Set up and install your SmartHub",
    isAvailable: ({ connectionName }: Partial<InstallAndConnectFormFields>) => {
      return !!connectionName;
    },
    /**
     * restrictions:
     *    if !argoAgreement in InstallAndConnectStore, show modal.
     *    if !connectionName in InstallAndConnectStore, check `useResolveConnectionName` if still
     *      not present,  redirect to /install/2
     */
    // work: installMDAIHub; establish namespace
  },
  {
    Component: DeployCollector,
    label: "Prepare and deploy collector",
    isAvailable: ({
      connectionName,
      namespace,
    }: Partial<InstallAndConnectFormFields>) => {
      return !!connectionName && !!namespace;
    },
    /**
     * restrictions:
     *    if !argoAgreement in InstallAndConnectStore, show modal.
     *    if !connectionName in InstallAndConnectStore, check `useResolveConnectionName` if still
     *      not present,  redirect to /install/2
     *    if !namespace, check installStatus if error/absent: redirect to /install/3
     */
    // work: saveDatadogIntegration, createConnection; establish telemetryTypes = [], datadogURL
  },
  {
    Component: UpdateAgent,
    label: "Update Datadog agent and test",
    isAvailable: ({
      connectionName,
      namespace,
      telemetryTypes = [],
      url,
    }: Partial<InstallAndConnectFormFields>) =>
      !!connectionName &&
      !!namespace &&
      !!telemetryTypes.length &&
      (telemetryTypes.includes("logs") || telemetryTypes.includes("traces")) &&
      !!url,
    /**
     * restrictions:
     *    if !argoAgreement in InstallAndConnectStore, show modal.
     *    if !connectionName in InstallAndConnectStore, check `useResolveConnectionName` if still
     *      not present,  redirect to /install/2
     *    if !namespace, check installStatus if error/absent: redirect to /install/3
     *    if (!telemetryTypes.length || !datadogUrl) check `getDatadogIntegrations` &
     *      `getConnections` if error/absent: redirect to /install/4
     */
  },
  {
    Component: VerifyConnection,
    label: "Verify connection and data",
    isAvailable: ({
      connectionName,
      namespace,
      telemetryTypes = [],
      url,
    }: Partial<InstallAndConnectFormFields>) =>
      !!connectionName &&
      !!namespace &&
      !!telemetryTypes.length &&
      (telemetryTypes.includes("logs") || telemetryTypes.includes("traces")) &&
      !!url,
    /**
     * restrictions:
     *    if !argoAgreement in InstallAndConnectStore, show modal.
     *    if !connectionName in InstallAndConnectStore, check `useResolveConnectionName` if still
     *      not present,  redirect to /install/2
     *    if !namespace, check installStatus if error/absent: redirect to /install/3
     *    if (!telemetryTypes.length || !datadogUrl) check `getDatadogIntegrations` &
     *      `getConnections` if error/absent: redirect to /install/4
     */
  },
  {
    Component: NextSteps,
    label: "Next steps",
    isAvailable: ({
      connectionName,
      namespace,
      telemetryTypes = [],
      url,
    }: Partial<InstallAndConnectFormFields>) =>
      !!connectionName &&
      !!namespace &&
      !!telemetryTypes.length &&
      (telemetryTypes.includes("logs") || telemetryTypes.includes("traces")) &&
      !!url,
    /**
     * restrictions:
     *    if !argoAgreement in InstallAndConnectStore, show modal.
     *    if !connectionName in InstallAndConnectStore, check `useResolveConnectionName` if still
     *      not present,  redirect to /install/2
     *    if !namespace, check installStatus if error/absent: redirect to /install/3
     *    if (!telemetryTypes.length || !datadogUrl) check `getDatadogIntegrations` &
     *      `getConnections` if error/absent: redirect to /install/4
     */
  },
].map((config, index) => ({
  ...config,
  path: `${ROUTES.INSTALL}/${(index + 1).toString()}`,
}));
