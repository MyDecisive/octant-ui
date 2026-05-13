import { Accordion } from "@components/Accordion";
import Divider from "@mui/material/Divider";
import { Fragment } from "react";
import { FixCard, type FixInfo } from "./FixCard";
import { HealthFacetRow, type HealthFacet } from "./HealthFacetRow";
import "./HealthWidget.css";
import { HealthWidgetTitle } from "./HealthWidgetTitle";

export interface HealthWidgetProps {
  title: string;
  status?: "error" | "operational" | "loading";
  fix?: FixInfo;
  facets?: HealthFacet[];
  simple?: boolean;
}

export function HealthWidget({
  title,
  status,
  fix,
  facets,
  simple,
}: HealthWidgetProps) {
  return (
    <Accordion
      className="health-widget-container"
      title={<HealthWidgetTitle title={title} status={status} />}
      {...(simple && {
        hideExpandIcon: true,
        summaryClassName: "no-close",
        expanded: !!fix,
        onChange: () => {},
      })}
      content={
        <>
          {fix && <FixCard {...fix} />}
          {!simple &&
            facets?.map((facet, index) => (
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
