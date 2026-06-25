import type { HealthWidgetProps } from "@app-types/components";
import { Accordion } from "@components/Accordion";
import Divider from "@mui/material/Divider";
import classNames from "classnames";
import { Fragment } from "react";
import { FixCard } from "./FixCard";
import { HealthFacetRow } from "./HealthFacetRow";
import "./HealthWidget.css";
import { HealthWidgetTitle } from "./HealthWidgetTitle";

export function HealthWidget({
  title,
  timestamp,
  status,
  fix,
  facets,
  simple,
  containerClassName,
}: HealthWidgetProps) {
  return (
    <Accordion
      className={classNames("health-widget-container", containerClassName)}
      title={
        <HealthWidgetTitle
          title={title}
          timestamp={timestamp}
          status={status}
        />
      }
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
