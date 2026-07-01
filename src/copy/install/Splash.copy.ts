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

export const DemoSplashCopy = {
  // SS-01
  header: "Welcome to Octant UI Demo",
  // SS-02
  subheader:
    "This is a backless demo, it will walk you through the ux of octant.",
  // SS-03
  rocket: "See how you'd connect your cluster.",
  // SS-04
  gear: "See how you'd deploy SmartHub.",
  // SS-05
  wire: "Watch how you'd route your data.",
  // SS-06
  cta: "Try it now",
} satisfies SplashConfig;
