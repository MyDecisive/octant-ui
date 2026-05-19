type Tile = {
  title: string;
  description: string;
  pill?: string;
  ctaPrimary: string;
  ctaSecondary?: string;
}

type NextStepsConfig = {
  header: string;
  subtitle: string;
  tile1: Tile;
  tile2: Tile;
  tile3: Tile;
}

export const NextStepsCopy = {
  // IC7-01
  header: "Next Steps",
  // IC7-02
  subtitle: "When you're ready, feel free to check out our labs catalog or manage your Argo changes.",
  tile1: {
    // IC7-03
    title: "Start budgeting now",
    // IC7-04
    description: "{sales-y description goes here}",
    // IC7-05
    pill: "Recommended",
    // IC7-03
    ctaPrimary: "Go to Clarity",
  },
  tile2: {
    // IC7-06
    title: "Migrate Smarthub into production",
    // IC7-07
    description: "Ready to go live? Follow our step-by-step guide to safely migrate Smarthub from your current environment into production.",
    // IC7-08
    ctaPrimary: "See our docs",
  },
  tile3: {
    // IC7-09
    title: "Commit your changes to Source control",
    // IC7-10
    description: "Your manifests are ready. Push them to your repository to make the configuration official and version-controlled.",
    // IC7-11
    ctaPrimary: "Download .zip first",
    // IC7-12
    ctaSecondary: "Go to Docs",
  },
} satisfies NextStepsConfig;
