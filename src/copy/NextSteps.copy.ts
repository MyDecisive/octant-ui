type Tile = {
  title: string;
  description: string;
  pill?: string;
  ctaPrimary: string;
  ctaSecondary?: string;
};

type NextStepsConfig = {
  header: string;
  subtitle: string;
  tile1: Tile;
  tile2: Tile;
  tile3: Tile;
};

export const NextStepsCopy = {
  // IC7-01
  header: "Next Steps",
  // IC7-02
  subtitle:
    "Ready to move out of the test environment? Review our architecture guidelines and best practices for safely rolling out SmartHub to your production clusters.",
  tile1: {
    // IC7-03
    title: "View your Clarity Dashboard",
    // IC7-04
    description:
      "See your live telemetry in action. Dive into your immediate cost savings, payload reductions, and active routing metrics.",
    // IC7-05
    pill: "Recommended",
    // IC7-03
    ctaPrimary: "Go to Clarity",
  },
  tile2: {
    // IC7-06
    title: "Deploy to Production",
    // IC7-07
    description:
      "Ready to move out of the test environment? Review our architecture guidelines and best practices for safely rolling out SmartHub to your production clusters.",
    // IC7-08
    ctaPrimary: "View Production Docs",
  },
  tile3: {
    // IC7-09
    title: "Commit to Source Control (GitOps)",
    // IC7-10
    description:
      "Make your configuration official. Download your generated manifests so you can push them to your Git repository and manage your SmartHub via version control.",
    // IC7-11
    ctaPrimary: "Download Manifests (.zip)",
    // IC7-12
    ctaSecondary: "View GitOps Docs",
  },
} satisfies NextStepsConfig;
