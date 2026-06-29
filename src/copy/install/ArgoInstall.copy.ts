type DeployArgoConfig = {
  header: string;
  subheader: string;
  checkboxTxt: string;
  continueNotice: string;
  cta: string;
  ctaAlt: string;
};

export const DeployArgoCopy = {
  // IC1-01
  header: "Deploy via ArgoCD",
  // IC1-02
  subheader:
    "Octant will automatically generate and sync ArgoCD applications to deploy SmartHub and manage your pipeline configurations.",
  // IC1-03
  checkboxTxt:
    "I authorize Octant to create and manage ArgoCD applications in my cluster.",
  // IC1-04
  cta: "Next",
  continueNotice:
    "By continuing, I authorize Octant to create and manage ArgoCD applications in my cluster.",
  ctaAlt: "Continue",
} satisfies DeployArgoConfig;
