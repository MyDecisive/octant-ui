import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { useState } from "react";
import "./HoverPopover.css";

interface HoverPopoverProps {
  children: ReactNode;
  message: string;
}

export function HoverPopover({ children, message }: HoverPopoverProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const popoverOpen = Boolean(anchorElement);

  return (
    <>
      <span
        onMouseEnter={(event) => {
          setAnchorElement(event.currentTarget);
        }}
        onMouseLeave={() => {
          setAnchorElement(null);
        }}
      >
        {children}
      </span>
      <Popover
        className="hover-popover"
        open={popoverOpen}
        anchorEl={anchorElement}
        onClose={() => {
          setAnchorElement(null);
        }}
        disableRestoreFocus
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            className: "hover-popover-paper",
          },
        }}
      >
        <Typography className="hover-popover-text" component="span">
          {message}
        </Typography>
      </Popover>
    </>
  );
}
