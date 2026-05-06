import { Accordion } from "@components/Accordion";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { determineWidgetAccordionProps } from "./determineWidgetAccordionProps";
import { FixCard, type FixInfo } from "./FixCard";
import "./HealthWidget.css";

export interface HealthWidgetProps {
  title: string;
  status: "error" | "operational";
  fix?: FixInfo;
}

export function HealthWidget({ title, status, fix }: HealthWidgetProps) {
  const accordionProps = determineWidgetAccordionProps({ status, fix, title });
  return (
    <Accordion
      className="health-widget-container"
      {...accordionProps}
      title={
        <Stack
          className="health-widget-title-container"
          justifyContent={"space-between"}
          alignContent={"center"}
          direction={"row"}
        >
          <Typography variant="body1" bold>
            {title}
          </Typography>
          {status === "error" ? (
            <Chip variant="filled" size="small" color="error" label="Error" />
          ) : (
            <Chip
              variant="filled"
              size="small"
              color="success"
              label="Operational"
            />
          )}
        </Stack>
      }
      content={fix && <FixCard {...fix} />}
    />
  );
}
