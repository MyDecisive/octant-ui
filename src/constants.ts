export const StepDefinitions = [
  // User has installed the hub via Helm
  {
    id: 1,
    key: "connect-1",
    title: "Pick a branch",
    description:
      "Provide targetRevision branch for your Argo CD or Datadog Connect app",
    forms: [
      {
        id: 1,
        label: "Target branch",
        formType: "text",
      },
    ],
  },
  // User needs to select an integration to connect to the hub, for first iteration only Datadog is available
  {
    id: 2,
    key: "connect-2",
    title: "Configure your collector",
    description:
      "Set up your collector with your credentials and data collection preferences.",
    forms: [
      {
        id: 1,
        label: "Name your collector",
        formType: "text",
      },
      {
        id: 2,
        label: "Namespace",
        formType: "text",
        optional: true,
        helperText:
          "The collector will default to the MDAI namespace if you do not provide one.",
      },
      {
        id: 3,
        label: "Datadog API Key",
        formType: "text",
        infoText: {
          title: "Update URL in Datadog",
          description:
            "Now that you’ve provided a name for the collector and namespace, you’ll need to go to your. Datadog agent to update the URL. [link to DD here]",
        },
      },
    ],
  },
  // User has selected an integration, but data isn't flowing yet. For Datadog, this means they need to provide their API key and confirm the connection. Status should update in real time as the WTAPI confirms the connection and starts receiving data.
  {
    id: 3,
    key: "connect-3",
    title: "Tell us where you want to send your data",
    forms: [
      {
        id: 1,
        formType: "radio",
        options: [
          { label: "Datadog", value: "datadog" },
          { label: "OTLP GRPC", value: "otlp_grpc" },
          { label: "OTLP HTTP", value: "otlp_http" },
        ],
      },
      {
        id: 2,
        formType: "text",
      },
    ],
  },
  // Once User has connected their integration and data is flowing
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
