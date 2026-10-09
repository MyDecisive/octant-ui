type SettingsCopyConfig = {
  headerActions: {
    downloadManifests: string;
    gitOpsTooltip: {
      title: string;
      description: string;
      cta: string;
      href: string;
    };
  };
  updateSettings: {
    initial: string;
    activated: string;
    missingConnectionError: string;
  };
  updateAgentDialog: {
    title: string;
    cta: string;
    description: string;
    instructions: string;
  };
};

export const SettingsCopy = {
  headerActions: {
    downloadManifests: "Download manifests",
    gitOpsTooltip: {
      title: "Commit changes to source control",
      description:
        "When you’re ready, push them to your repository to make the configuration official and version-controlled.",
      cta: "See our docs for help",
      href: "https://docs.mydecisive.ai/",
    },
  },
  updateSettings: {
    initial: "Update settings",
    activated: "Updating settings",
    missingConnectionError:
      "No active connection was found for these settings.",
  },
  updateAgentDialog: {
    title: "Update your Datadog agent",
    cta: "I've updated my Datadog agent",
    description:
      "Update your Datadog agent config in your Kubernetes cluster or Argo CD project and restart it with the updated manifest changes.",
    instructions:
      "To update, you’ll need to copy and paste the code snippet of the data type(s) you previously selected.",
  },
} satisfies SettingsCopyConfig;
