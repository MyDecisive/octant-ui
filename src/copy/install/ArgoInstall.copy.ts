interface IDeployArgo {
  header: string;
  subheader: string;
  checkboxTxt: string;
  cta: string;
}

export const DeployArgoCopy: IDeployArgo = {
  // IC1-01
  header: "Deploy via ArgoCD",
  // IC1-02
  subheader: "Octant will automatically generate and sync ArgoCD applications to deploy Smarthub and manage your pipeline configurations.",
  // IC1-03
  checkboxTxt: "I authorize Octant to create and manage ArgoCD applications in my cluster.",
  // IC1-04
  cta: "Next",
};
