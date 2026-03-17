import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import { useMemo } from "react";

interface InfoTooltipProps {
  text: string;
  filled?: boolean;
}

export function InfoTooltip({ text, filled }: InfoTooltipProps) {
  const Icon = useMemo(() => {
    return filled ? InfoIcon : InfoOutlinedIcon;
  }, [filled]);

  return (
    <Tooltip title={text} placement="right" arrow>
      <Icon />
    </Tooltip>
  );
}
