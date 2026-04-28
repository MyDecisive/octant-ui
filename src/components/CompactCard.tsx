import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import classNames from "classnames";
import type { ReactNode } from "react";
import "./CompactCard.css";

export interface CompactCardProps {
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

export function CompactCard({
  header,
  content,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: CompactCardProps) {
  return (
    <Card className={classNames("mdai-compact-card-container", className)}>
      {header && (
        <CardHeader
          className={classNames("mdai-compact-card-header", headerClassName)}
          title={header}
        />
      )}
      {content && (
        <CardContent
          className={classNames("mdai-compact-card-content", contentClassName)}
        >
          {content}
        </CardContent>
      )}
      {footer && (
        <CardActions
          className={classNames("mdai-compact-card-footer", footerClassName)}
        >
          {footer}
        </CardActions>
      )}
    </Card>
  );
}
