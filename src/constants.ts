type StepKey = string;

type StepMapType = Record<StepKey, { title: string; description?: string }>;

const StepMap: StepMapType = {
  "connect-1": {
    title: "Pick a branch",
    description:
      "We are about to create some Argo apps. Let us know if you’re comfortable with us directly pushing those apps to your Argo CD server on your behalf. \n\n Note: Do not deploy to a branch that is actively in development (ex. production environment).",
  },
  "connect-2": {
    title: "Configure your collector",
    description:
      "Set up your collector with your credentials and data collection preferences.",
  },
  "connect-3": {
    title: "Tell us where you want to send your data",
  },
  "connect-4": {
    title: "Select telemetry types",
    description: "What type(s) of telemetry do you want us to capture for you?",
  },
  "connect-5": {
    title: "Override",
    description:
      "We're about to override your ArgoCD settings. Once the connection becomes successful, go to Datadog to check for telemetry flow.",
  },
  "connect-6": {
    title: "Next steps",
    description:
      "We're about to override your ArgoCD settings. If you prefer to do this in your typical GitOps flow, go create a pull request and get this merged into your target branch. Once the connection becomes successful, go to Datadog to check for telemetry flows",
  },
};

const stepOrder: StepKey[] = [
  "connect-1",
  "connect-2",
  "connect-3",
  "connect-4",
  "connect-5",
  "connect-6",
];

export const StepDefinitions = stepOrder.map((stepKey) => ({
  ...StepMap[stepKey],
  key: stepKey,
}));

export const integrationOptions = [
  { label: "Datadog", value: "datadog", authType: "apiKey" },
  { label: "GitHub", value: "github", authType: "oauth" },
  { label: "Other", value: "other", authType: "none" },
];
