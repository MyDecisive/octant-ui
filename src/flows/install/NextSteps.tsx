import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { SimpleCard } from "@components/SimpleCard";
import { ViewTitle } from "@components/ViewTitle";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useLocation } from "wouter";
import { ROUTES } from "../../constants/ROUTES";
import { useFetchManifestsAndDownload } from "./useFetchManifestsAndDownload";

export function NextSteps() {
  const [, setLocation] = useLocation();
  const { loading, fetchAndDownload } = useFetchManifestsAndDownload();

  const handleDownloadManifestsClick = () => fetchAndDownload();

  return (
    <FlowCenterColumn>
      <ViewTitle
        title="Next steps"
        description="You’re all set. When you’re ready, feel free to check out our labs catalog or manage your Argo changes."
      />

      <SimpleCard
        title="Start budgeting now"
        description="{sales-y description goes here}"
        headerAction={<Chip color="info" label="Recommended" size="small" />}
        footer={
          <Button
            variant="text"
            onClick={() => setLocation(ROUTES.CLARITY)}
            size="small"
            disableRipple
          >
            Go to Clarity
          </Button>
        }
      />
      <SimpleCard
        title="Migrate Smarthub into production"
        description="Ready to go live? Follow our step-by-step guide to safely migrate Smarthub from your current environment into production."
        footer={
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
    </FlowCenterColumn>
  );
}
