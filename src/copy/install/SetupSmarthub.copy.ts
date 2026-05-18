import type { InputProps } from "@components/formInputs/Input";

interface ISmartHub {
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
  errModal: {
    header: string;
    body: string;
    cta: string;
  };
  warnModal: {
    header: string;
    body: string;
    cta1: string;
    cta2: string;
  };
}

export const SmarthubCopy: ISmartHub = {
  // IC3-01
  header: "Deploy Smarthub",
  // IC3-02
  subheader: "Specify the Kubernetes namespace where Octant will deploy the Smarthub engine and its associated resources. If the namespace does not exist, ArgoCD will create it.",
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
  loadingTxt: "Syncing resources via ArgoCD. This usually takes 2-10 minutes depending on your cluster.",
  errModal: {
    // IC3-10
    header: "Deployment Failed",
    // IC3-11
    body: "An unexpected error occurred while deploying to your cluster. Please review your cluster logs or consult our troubleshooting guide for assistance.",
    // IC3-12
    cta: "Retry Deployment",
  },
  warnModal: {
    // IC3-??
    header: "Still waiting",
    // IC3-??
    body: "We're still not sure whether or not things are running correctly. What would you like to do?",
    // IC3-??
    cta1: "Keep waiting",
    // IC3-??
    cta2: "It's ok, let's keep going",
  },
  // IC3-??
  genericFormErrorTxt: "Something went wrong.",
};
