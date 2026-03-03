export const StepDefinitions = [
  {
    id: 1,
    key: "connect-1",
    title: "Pick a branch",
    description:
      "Provide targetRevision branch for your Argo CD or Datadog Connect app",
  },
  {
    id: 2,
    key: "connect-2",
    title: "Configure your collector",
    description:
      "Set up your collector with your credentials and data collection preferences.",
  },
  {
    id: 3,
    key: "connect-3",
    title: "Tell us where you want to send your data",
  },
  {
    id: 4,
    key: "connect-4",
    title: "Select telemetry types",
    description: "What type(s) of telemetry do you want us to capture for you?",
  },

  {
    id: 5,
    key: "connect-5",
    title: "Override",
    description:
      "We’re about to override your ArgoCD settings.  Once the connection becomes successful, go to Datadog to check for telemetry flow.",
  },
  {
    id: 6,
    key: "connect-6",
    title: "Next steps",
    description:
      "We’re about to override your ArgoCD settings. If you prefer to do this in your typical GitOps flow, go create a pull request and get this merged into your target branch.  Once the connection becomes successful, go to Datadog to check for telemetry flows",
  },
];

export const integrationOptions = [
  { label: "Datadog", value: "datadog", authType: "apiKey" },
  { label: "GitHub", value: "github", authType: "oauth" },
  { label: "Other", value: "other", authType: "none" },
];
