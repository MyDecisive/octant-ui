import Button from "@mui/material/Button";
import { useConnectStore } from "@store/connectStore";
import { VIEW_ORDER } from "../flows/install";

export function NextButton({ disabled, ctaTxt }: { disabled: boolean, ctaTxt: string; }) {
  const activeView = useConnectStore((state) => state.activeView);
  const setActiveView = useConnectStore((state) => state.setActiveView);

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
      {ctaTxt || "Next"}
    </Button>
  );
}
