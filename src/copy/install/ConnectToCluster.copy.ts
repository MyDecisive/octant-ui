interface ConnectInputs {
  label: string;
  placeholder?: string;
  helpTxt?: string;
  errorTxt?: string;
  tooltip?: string;
};

interface IConnectToCluster {
  header: string;
  subheader: string;
  nameThisConnection: ConnectInputs;
  argoUrl: ConnectInputs;
  argoToken: ConnectInputs;
  formError: {
    header: string;
    genericError: string;
    argoSpecificError: string;
    ctaTxt: string;
  };
  ctaTxt: {
    initial: string;
    activated: string;
  };
}

export const ConnectToClusterCopy: IConnectToCluster = {
  // IC2-01
  header: "Connect to your Kubernetes Cluster",
  // IC2-02
  subheader: "Enter your ArgoCD details below so Octant can securely sync and manage your deployment.",
  nameThisConnection: {
    // IC2-03
    label: "Name this connection",
    // IC2-04
    helpTxt: "We recommend using a recognizable name that can be easily referenced later",
  },
  argoUrl: {
    // IC2-05
    label: "ArgoCD Cluster URL",
    // IC2-06
    placeholder: "e.g. https://argocd.<your-domain>",
    // IC2-07
    helpTxt: "The public or internal URL where your ArgoCD instance is hosted.",
    // IC2-08
    errorTxt: "Please enter a valid URL, including the protocol (e.g., https://argocd.yourdomain.com).",
    tooltip: "Target Argo URL is where these changes will live in your version control platform. Please make sure this Argo URL changes as your promote this change through your SDLC environments."
  },
  argoToken: {
    // IC2-09
    label: "ArgoCD API token",
    // IC2-10
    placeholder: "argocd.token.xxxxxxx",
    // IC2-11
    helpTxt: "Generate this in your ArgoCD dashboard under Settings > Accounts > Generate Token.",
    // IC2-12
    errorTxt: "Invalid or expired token. Please verify the token has the correct permissions and was copied without trailing spaces, or generate a new one.",
  },
  formError: {
    // IC2-13
    header: "Connection Failed",
    // IC2-14
    genericError: "Octant could not reach your ArgoCD instance. Please verify your URL, token permissions, and network/firewall rules",
    argoSpecificError: "Credentials are invalid. Please regenerate your token, check your URL, and try again.",
    // IC2-15
    ctaTxt: "View troubleshooting guide",
  },
  ctaTxt: {
    // IC2-16
    initial: "Verify & Connect",
    // IC2-17
    activated: "Connecting to your cluster...",
  },
};
