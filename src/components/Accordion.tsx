import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion, {
  type AccordionProps as MuiAccordionProps,
} from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import classNames from "classnames";
import { useId, type ReactNode } from "react";
import "./Accordion.css";

interface AccordionProps extends Omit<
  MuiAccordionProps,
  "title" | "content" | "children"
> {
  title: ReactNode;
  content: ReactNode;
  className?: string;
  summaryClassName?: string;
  contentContainerClassname?: string;
  transitionClassname?: string;
  hideExpandIcon?: boolean;
}

export function Accordion({
  title,
  content,
  className,
  summaryClassName,
  contentContainerClassname,
  transitionClassname,
  hideExpandIcon,
  ...rest
}: AccordionProps) {
  const panelId = useId();
  const summaryId = `${panelId}-header`;
  const contentId = `${panelId}-content`;

  return (
    <MuiAccordion
      {...rest}
      className={classNames("mdai-accordion-container", className)}
      slotProps={{
        transition: {
          className: classNames(
            "mdai-accordion-contents-container",
            transitionClassname,
          ),
        },
      }}
    >
      <AccordionSummary
        expandIcon={hideExpandIcon ? null : <ExpandMoreIcon />}
        aria-controls={contentId}
        id={summaryId}
        className={classNames("mdai-accordion-summary", summaryClassName)}
      >
        {typeof title === "string" ? (
          <Typography component="span">{title}</Typography>
        ) : (
          title
        )}
      </AccordionSummary>
      <AccordionDetails
        className={classNames(
          "mdai-accordion-contents",
          contentContainerClassname,
        )}
        id={contentId}
        aria-labelledby={summaryId}
      >
        {content}
      </AccordionDetails>
    </MuiAccordion>
  );
}
