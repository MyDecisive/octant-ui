import Button from "@mui/material/Button";
import { useAdvanceInstallAndConnect } from "@utils/useAdvanceInstallAndConnect";

export function NextButton({
  disabled,
  ctaTxt,
}: {
  disabled: boolean;
  ctaTxt?: string;
}) {
  const advanceInstallFlow = useAdvanceInstallAndConnect();

  return (
    <Button
      className="flow-next-button"
      variant="contained"
      size="small"
      type={"button"}
      onClick={advanceInstallFlow}
      disabled={disabled}
      color={!disabled ? "primary" : "secondary"}
    >
      {ctaTxt || "Next"}
    </Button>
  );
}
