export const navSteps = [
  // User has installed the hub via Helm
  {
    id: 1,
    title: "Configure your vendor agent",
    subtitle: "Activate your hub to get started.",
    status: "Hub installed",
    button: "Activate",
  },
  // User needs to select an integration to connect to the hub, for first iteration only Datadog is available
  {
    id: 2,
    title: "Get your data flowing",
    subtitle: "Select an integration to connect",
    status: "Waiting on integration",
    button: "Integrate",
  },
  // User has selected an integration, but data isn't flowing yet. For Datadog, this means they need to provide their API key and confirm the connection. Status should update in real time as the WTAPI confirms the connection and starts receiving data.
  {
    id: 3,
    title: "Connect your DataDog",
    subtitle: "Provide your DataDog API key to connect",
    status: "DataDog not connected",
    button: "Configure",
  },
  // Once User has connected their integration and data is flowing
  {
    id: 4,
    title: "Select your hub configurations",
    subtitle: "Select the configuration that best fits your needs",
    status: "DataDog Connected",
  },
];

export const integrationOptions = [
  { label: "Datadog", value: "datadog", authType: "apiKey" },
  { label: "GitHub", value: "github", authType: "oauth" },
  { label: "Other", value: "other", authType: "none" },
];
