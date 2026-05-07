import { Accordion } from "@components/Accordion";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import { determineWidgetAccordionProps } from "./determineWidgetAccordionProps";
import { FixCard, type FixInfo } from "./FixCard";
import { HeaderStatusChip } from "./HeaderStatusChip";
import { HealthFacetRow, type HealthFacet } from "./HealthFacetRow";
import "./HealthWidget.css";

export interface HealthWidgetProps {
  title: string;
  status: "error" | "operational" | "loading";
  fix?: FixInfo;
  facets?: HealthFacet[];
}

export function HealthWidget({
  title,
  status,
  fix,
  facets,
}: HealthWidgetProps) {
  const accordionProps = determineWidgetAccordionProps({
    status,
    fix,
    title,
    facets,
  });
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
          <HeaderStatusChip status={status} />
        </Stack>
      }
      content={
        <>
          {fix && <FixCard {...fix} />}
          {facets &&
            facets.map((facet, index) => (
              <Fragment key={facet.label}>
                <HealthFacetRow {...facet} />
                {index !== facets.length - 1 && <Divider />}
              </Fragment>
            ))}
        </>
      }
    />
  );
}
