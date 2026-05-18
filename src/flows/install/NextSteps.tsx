import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { SimpleCard } from "@components/SimpleCard";
import { ViewTitle } from "@components/ViewTitle";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useLocation } from "wouter";
import { ROUTES } from "../../constants/ROUTES";
import { useFetchManifestsAndDownload } from "./useFetchManifestsAndDownload";
import { NextStepsCopy as copy } from "../../copy/NextSteps.copy";

export function NextSteps() {
  const [, setLocation] = useLocation();
  const { loading, fetchAndDownload } = useFetchManifestsAndDownload();

  const handleDownloadManifestsClick = () => fetchAndDownload();

  return (
    <FlowCenterColumn>
      <ViewTitle
        title={copy.header}
        description={copy.subtitle}
      />

      <SimpleCard
        title={copy.tile1.title}
        description={copy.tile1.description}
        headerAction={<Chip color="info" label={copy.tile1.pill} size="small" />}
        footer={
          <Button
            variant="text"
            onClick={() => setLocation(ROUTES.CLARITY)}
            size="small"
            disableRipple
          >
            {copy.tile1.cta}
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
            href="https://docs.mydecisive.ai/"
            size="small"
            disableRipple
          >
            {copy.tile2.cta}
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
              onClick={void handleDownloadManifestsClick}
              loading={loading}
            >
              {copy.tile2.cta}
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
              {copy.tile2.cta2}
            </Button>
          </ButtonRow>
        }
      />
    </FlowCenterColumn>
  );
}
