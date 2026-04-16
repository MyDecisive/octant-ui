import { CodeSnippet } from "@components/CodeSnippet";
import { ButtonRow } from "@components/layout/ButtonRow";
import { CenterColumn } from "@components/layout/CenterColumn";
import { SimpleCard } from "@components/SimpleCard";
import { ViewTitle } from "@components/ViewTitle";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useOctantConnectStore } from "@store";
import { useFetchManifestsAndDownload } from "./useFetchManifestsAndDownload";

export function NextSteps() {
  const connectionName = useOctantConnectStore(
    (state) => state.form.connectionName,
  );

  const { loading, fetchAndDownload } = useFetchManifestsAndDownload();

  const handleDownloadManifestsClick = () => fetchAndDownload();

  return (
    <CenterColumn>
      <ViewTitle
        title="Next steps"
        description="You’re all set. When you’re ready, feel free to check out our labs catalog or manage your Argo changes."
      />

      <SimpleCard
        title="Start budgeting now"
        description="{sales-y description goes here}"
        headerAction={<Chip color="primary" label="Recommended" size="small" />}
      />
      <SimpleCard
        title="Migrate Smarthub into production"
        description="Ready to go live? Follow our step-by-step guide to safely migrate Smarthub from your current environment into production."
        headerAction={
          <Button
            variant="text"
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.mydecisive.ai/"
            size="small"
            disableRipple
          >
            See our docs
          </Button>
        }
      />
      <SimpleCard
        title="Commit your changes to Source control"
        description="Your manifests are ready. Push them to your repository to make the configuration official and version-controlled."
        footer={
          <ButtonRow>
            <Button
              variant="text"
              size="small"
              disableRipple
              onClick={handleDownloadManifestsClick}
              loading={loading}
            >
              Download .zip first
            </Button>
            <Button
              variant="text"
              color="secondary"
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.mydecisive.ai/"
              size="small"
              disableRipple
            >
              Go to docs
            </Button>
          </ButtonRow>
        }
      />
      <SimpleCard
        title="Revert your Argo CD & Datadog agent changes"
        description="Something didn't go as planned. Run the command below to restore both your Argo CD configuration and Datadog agent to their previous state:"
      >
        <CodeSnippet code={`argocd app delete ${connectionName}`} />
      </SimpleCard>
    </CenterColumn>
  );
}
