import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Alert } from "./Alert";

export function MobileWarn() {
  const [dismissed, setDismissed] = useState(false);
  const matches = useMediaQuery('(max-width:800px)');

  if (!matches || dismissed) { return <></> }

  return <Alert
    title="Octant is intended for desktop use"
    description="Octant is not optimized for use on mobile devices. Please check us out on a bigger screen!"
    severity="error"
    onClose={() => setDismissed(true)} />
}