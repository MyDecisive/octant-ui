import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Alert } from "./Alert";

export function MobileWarn() {
  const [dismissed, setDismissed] = useState(false);
  const matches = useMediaQuery('(max-width:800px)');

  if (!matches || dismissed) { return <></> }

  return <Alert
    description="We are currently optimizing our mobile experience. In the meantime, please view on a larger screen for the best experience."
    severity="error"
    onClose={() => setDismissed(true)} />
}