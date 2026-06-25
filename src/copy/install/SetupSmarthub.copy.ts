import type { InputProps } from "@app-types/components";
import type { ErrorModalContent } from "@app-types/copy";
import { ERROR_MODAL_ACT, ERROR_SEVERITY } from "@constants/enums";

type SmartHubConfig = {
  header: string;
  subheader: string;
  nsHeader: string;
  k8sNsInput: InputProps;
  cta: {
    initial: string;
    activated: string;
  };
  genericFormErrorTxt: string;
  loadingTxt: string;
  infoTxt: string;
  installErrorModal: ErrorModalContent;
  installStatusErrorModal: ErrorModalContent;
  installStatusTimeoutModal: ErrorModalContent;
};

const installStatusErrorModal: ErrorModalContent = {
  // IC3-10
  header: "Install Failed",
  // IC3-11
  body: "Something went wrong during installation. You can try installing again, check our <troubleshooting guide> for help, or report a bug if the issue persists.",
  // IC3-12
  actions: [
    {
      text: "Report a bug",
      act: [ERROR_MODAL_ACT.REPORT_BUG],
    },
    {
      text: "Retry install",
      act: [ERROR_MODAL_ACT.CLOSE],
    },
  ],
  severity: ERROR_SEVERITY.ERROR,
};

const installStatusTimeoutModal: ErrorModalContent = {
  severity: ERROR_SEVERITY.WARN,
  header: "Install still in progress",
  body: "We're sorry. Our system isn't quite ready to complete your installation yet. Please try again in a few moments.",
  actions: [
    {
      text: "Got it",
      act: [ERROR_MODAL_ACT.CLOSE],
    },
  ],
};

const installErrorModal: ErrorModalContent = {
  header: installStatusErrorModal.header,
  body: installStatusErrorModal.body,
  severity: installStatusErrorModal.severity,
  actions: [
    {
      text: "Retry install",
      act: [ERROR_MODAL_ACT.CLOSE],
    },
  ],
  showNetworkError: true,
};

export const SmarthubCopy = {
  // IC3-01
  header: "Deploy Smarthub",
  // IC3-02
  subheader:
    "Specify the Kubernetes namespace where Octant will deploy the Smarthub engine and its associated resources. If the namespace does not exist, ArgoCD will create it.",
  // IC3-03
  nsHeader: "Kubernetes Namespace",
  k8sNsInput: {
    // IC3-03
    label: "Kubernetes Namespace",
    // IC3-04
    helperText: "The dedicated namespace for all Smarthub components.",
    // IC3-05
    placeholder: "mdai",
  },
  cta: {
    // IC3-07
    activated: "Installing...",
    // IC3-09
    initial: "Deploy to Cluster",
  },
  // IC3-13
  loadingTxt: "Syncing resources via ArgoCD",
  infoTxt: "This usually takes 2-10 minutes",
  installStatusErrorModal,
  installStatusTimeoutModal,
  installErrorModal,
  // IC3-??
  genericFormErrorTxt: "Something went wrong.",
} satisfies SmartHubConfig;
