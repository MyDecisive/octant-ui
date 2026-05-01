import Button from "@mui/material/Button";
import { useOctantConnectStore } from "@store";
import { VIEW_ORDER } from "../flows/install";

export function NextButton({ disabled }: { disabled: boolean }) {
  const activeView = useOctantConnectStore((state) => state.activeView);
  const setActiveView = useOctantConnectStore((state) => state.setActiveView);

  const onClickProgress = () => {
    const currentViewIdx = VIEW_ORDER.indexOf(activeView);
    setActiveView(VIEW_ORDER[currentViewIdx + 1]);
  };

  return (
    <Button
      className="flow-next-button"
      variant="contained"
      size="small"
      type={"button"}
      onClick={onClickProgress}
      disabled={disabled}
      color={!disabled ? "primary" : "secondary"}
    >
      Next
    </Button>
  );
}
