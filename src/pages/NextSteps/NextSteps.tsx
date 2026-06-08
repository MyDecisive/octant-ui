import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { SimpleCard } from "@components/SimpleCard";
import { ViewTitle } from "@components/ViewTitle";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useLocation } from "wouter";
import { ROUTES } from "../../constants/routing";
import { NextStepsCopy as copy } from "../../copy/install/NextSteps.copy";

export function NextSteps() {
  const [, navigate] = useLocation();

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
            href="https://docs.mydecisive.ai/"
            size="small"
            disableRipple
          >
            {copy.tile2.ctaPrimary}
          </Button>
        }
      />
    </FlowCenterColumn>
  );
}
