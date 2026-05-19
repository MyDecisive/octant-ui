import type { InputProps } from "@components/formInputs/Input";
import type { TelemetryTypes } from "@types";

interface DeployCollectorCopy {
  header: string;
  subheader: string;
  sourceSection: {
    title: string;
    dropdown: {
      label: string;
      selected: string;
      options: {
        label: string;
        value: string;
      }[];
    };
    datatypes: {
      label: string;
      options: {
        label: string;
        value: TelemetryTypes;
      }[];
    };
  };
  destinationSection: {
    title: string;
    subtitle: string;
    dropdown: {
      label: string;
      selected: string;
      options: {
        label: string;
        value: string;
      }[];
    };
    destinationUrl: InputProps;
    destinationApiKey: InputProps;
  };
  cta: {
    initial: string;
    activated: string;
    timeText: string;
  };
  configViewer: {
    open: string;
    close: string;
  };
}

export const DeployCollectorCopy: DeployCollectorCopy = {
  // IC4-01
  header: "Configure Telemetry Routing",
  // IC4-02
  subheader:
    "Define how the Smarthub collector will intercept and route your data. You can update these pipeline rules later in your dashboard.",
  sourceSection: {
    // IC4-03
    title: "Data Source",
    dropdown: {
      // IC4-04
      label: "Data source",
      selected: "datadog",
      options: [
        {
          // IC4-05
          label: "Datadog",
          value: "datadog",
        },
      ],
    },
    datatypes: {
      // IC4-06
      label: "Which telemetry types do you want to manage?",
      options: [
        {
          // IC4-08
          label: "Logs",
          value: "logs",
        },
        {
          // IC4-09
          label: "Traces",
          value: "traces",
        },
      ],
    },
  },
  destinationSection: {
    // IC4-10
    title: "Data destination",
    // IC4-11
    subtitle: "Route data to your downstream observability platform.",
    dropdown: {
      // IC4-12
      label: "Vendor destination",
      selected: "datadog",
      options: [
        {
          // IC4-13
          label: "Datadog",
          value: "datadog",
        },
      ],
    },
    destinationUrl: {
      // IC4-14
      placeholder: "Destination URL",
      // IC4-14
      helperText:
        "Connect to region, e.g., datadoghq.com (US1) or datadoghq.eu (EU)",
    },
    destinationApiKey: {
      // IC4-15
      placeholder: "Datadog API key",
      // IC4-15
      helperText:
        "Generate this in Datadog under Organization Settings > API Keys. [Find your Datadog site region here].",
      // IC4-15
      tooltip: "Log into your Datadog account to acquire the API key",
    },
  },
  cta: {
    // IC4-18
    initial: "Deploy Collector",
    // IC4-19
    activated: "Deploying...",
    // IC4-22
    timeText: "This usually takes 2-5 minutes depending on your cluster.",
  },
  configViewer: {
    // TODO: Not incorporated yet, accordion component may need adjustment to inject copy based on state.
    // IC4-23
    open: "View YAML Config",
    close: "Hide YAML Config",
  },
};
