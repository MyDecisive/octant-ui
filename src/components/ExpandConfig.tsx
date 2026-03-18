import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { useId, useState } from "react";
import "./ExpandedConfig.css";

export function ExpandConfig({
  title,
  content,
}: {
  title: string;
  content: ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();
  const summaryId = `${panelId}-header`;
  const contentId = `${panelId}-content`;

  return (
    <Accordion
      expanded={isExpanded}
      onChange={(_event, expanded) => setIsExpanded(expanded)}
      className="expanded-config-container"
    >
      <AccordionSummary
        expandIcon={isExpanded ? <RemoveIcon /> : <AddIcon />}
        aria-controls={contentId}
        id={summaryId}
        className="expanded-config-summary"
      >
        <Typography component="span">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails id={contentId} aria-labelledby={summaryId}>
        {content}
      </AccordionDetails>
    </Accordion>
  );
}
