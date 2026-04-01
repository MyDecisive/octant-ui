import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useId, type ReactNode } from "react";
import "./ExpandedConfig.css";

export function ExpandConfig({
  title,
  content,
}: {
  title: string;
  content: ReactNode;
}) {
  const panelId = useId();
  const summaryId = `${panelId}-header`;
  const contentId = `${panelId}-content`;

  return (
    <Accordion className="expanded-config-container">
      <AccordionSummary
        expandIcon={null}
        aria-controls={contentId}
        id={summaryId}
        className="expanded-config-summary"
      >
        <Typography component="span">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails
        className="expanded-config-contents"
        id={contentId}
        aria-labelledby={summaryId}
      >
        {content}
      </AccordionDetails>
    </Accordion>
  );
}
