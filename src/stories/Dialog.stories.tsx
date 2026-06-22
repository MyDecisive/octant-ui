import { ArgoInstallDialog } from "@components/ArgoInstallDialog";
import { CodeSnippet } from "@components/CodeSnippet";
import { Dialog } from "@components/Dialog";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createInstallAndConnectStore } from "@store/installAndConnectStore";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { InstallAndConnectContext } from "../contexts/InstallAndConnect"; // adjust path

const code = `datadog:
  # Enable this only if applications send traces to the agent over TCP:8126
  portEnabled: true
  port: 8126

env:
  - name: DD_APM_DD_URL
    value: "http://dd-collector.mdai.svc.cluster.local:8126"`;

const meta = {
  title: "Display/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  args: {
    open: true,
    title: "Update your Datadog agent",
    onClose: () => null,
    children: (
      <Stack gap={1.5}>
        <Typography variant="body2" color="secondary">
          Update your Datadog agent config in your Kubernetes cluster or Argo CD
          project and restart it with the updated manifest changes.
        </Typography>
        <Typography variant="body2" color="secondary">
          To update, you’ll need to copy and paste the code snippet of the data
          type(s) you previously selected.
        </Typography>
        <CodeSnippet code={code} maxHeight="260px" />
      </Stack>
    ),
    actions: (
      <Button variant="contained" size="small">
        I've updated my Datadog agent
      </Button>
    ),
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Warning: Story = {
  args: {
    title: "Continue without validation?",
    icon: <WarningAmberRoundedIcon color="warning" />,
    description:
      "The install has not completed validation. You can continue, but some connection checks may be unavailable.",
    children: undefined,
    actions: (
      <>
        <Button variant="text" color="secondary">
          Cancel
        </Button>
        <Button variant="contained">Continue</Button>
      </>
    ),
  },
};

export const Error: Story = {
  args: {
    title: "Collector update failed",
    icon: <ErrorOutlineRoundedIcon color="error" />,
    description:
      "Octant could not finish applying the collector settings. Review the details below, then try again.",
    children: (
      <Typography variant="body2" color="secondary">
        Deployment timed out while waiting for collector pods to become ready.
      </Typography>
    ),
    actions: (
      <>
        <Button variant="text" color="secondary">
          Close
        </Button>
        <Button variant="contained">Try again</Button>
      </>
    ),
  },
};

export const ArgoInstall: Story = {
  render: () => {
    const store = createInstallAndConnectStore({
      argoAgreement: false,
      lastCompletedStep: 1,
    });
    const { hook } = memoryLocation({ path: "/some-other-route" });
    return (
      <InstallAndConnectContext value={store}>
        <Router hook={hook}>
          <ArgoInstallDialog />
        </Router>
      </InstallAndConnectContext>
    );
  },
};
