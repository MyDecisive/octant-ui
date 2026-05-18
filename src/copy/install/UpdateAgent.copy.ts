type UpdateAgentConfig = {
  header: string;
  subheader: string;
  ack: string;
  cta: string;
  timingTxt: string;
  myDecisiveLocation: string;
  datadogCodeBlock: string;
};

export const UpdateAgentCopy = {
  // IC5-01
  header: "Configure the Datadog Agent",
  // IC5-02
  subheader: "Route your existing Datadog agent's traffic to the Smarthub collector. Apply the environment variables provided on the right to your Datadog agent's values.yaml (or equivalent Kubernetes manifest), then restart the agent pods.",
  // IC5-05
  ack: "I have applied these changes and restarted the Datadog agent",
  // IC5-06
  cta: "Verify Connection",
  // IC5-07
  timingTxt: "This process can take up to 5 minutes.",
  // IC5-08
  datadogCodeBlock: "Example Datadog Agent Configuration",
  // IC5-09
  myDecisiveLocation: "SmartHub Internal Endpoint",
} satisfies UpdateAgentConfig;
