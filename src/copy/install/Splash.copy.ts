type SplashConfig = {
  header: string;
  subheader: string;
  rocket: string;
  gear: string;
  wire: string;
  cta: string;
};

export const SplashCopy = {
  // SS-01
  header: "Welcome to Octant",
  // SS-02
  subheader: "Get your OpenTelemetry pipeline running in minutes.",
  // SS-03
  rocket: "Connect your cluster.",
  // SS-04
  gear: "Deploy SmartHub.",
  // SS-05
  wire: "Route your data.",
  // SS-06
  cta: "Let's Build",
} satisfies SplashConfig;
