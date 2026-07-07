import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { SimpleCard } from "@components/SimpleCard";
import { ViewTitle } from "@components/ViewTitle";
import { ROUTES } from "@constants/routing";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";
import { NextStepsCopy as copy } from "../copy/install/NextSteps.copy";
import { useFetchManifestsAndDownload } from "../hooks/useFetchManifestsAndDownload";

export function NextSteps() {
  const [, navigate] = useLocation();
  const { connectionName, mdaiVersion, namespace, telemetryTypes } =
    useInstallAndConnectStore(
      useShallow(
        ({ connectionName, mdaiVersion, namespace, telemetryTypes }) => ({
          connectionName,
          mdaiVersion,
          namespace,
          telemetryTypes,
        }),
      ),
    );
  const { loading, fetchAndDownload } = useFetchManifestsAndDownload({
    connectionName,
    mdaiVersion,
    namespace,
    telemetryTypes,
  });

  const handleDownloadManifestsClick = () => {
    void fetchAndDownload();
  };

  return (
    <FlowCenterColumn>
      <ViewTitle title={copy.header} description={copy.subtitle} />

      <SimpleCard
        title={copy.tile1.title}
        description={copy.tile1.description}
        headerAction={
          <Chip color="info" label={copy.tile1.pill} size="small" />
        }
        footer={
          <Button
            variant="text"
            onClick={() => navigate(ROUTES.CLARITY)}
            size="small"
            disableRipple
          >
            {copy.tile1.ctaPrimary}
          </Button>
        }
      />
      <SimpleCard
        title={copy.tile2.title}
        description={copy.tile2.description}
        footer={
          <Button
            variant="text"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/MyDecisive/octant/blob/main/docs/how-to/production.md"
            size="small"
            disableRipple
          >
            {copy.tile2.ctaPrimary}
          </Button>
        }
      />
      <SimpleCard
        title={copy.tile3.title}
        description={copy.tile3.description}
        footer={
          <ButtonRow>
            <Button
              variant="text"
              size="small"
              disableRipple
              onClick={handleDownloadManifestsClick}
              loading={loading}
            >
              {copy.tile3.ctaPrimary}
            </Button>
            <Button
              variant="text"
              color="secondary"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/MyDecisive/octant/blob/main/docs/how-to/gitops.md"
              size="small"
              disableRipple
            >
              {copy.tile3.ctaSecondary}
            </Button>
          </ButtonRow>
        }
      />
    </FlowCenterColumn>
  );
}
