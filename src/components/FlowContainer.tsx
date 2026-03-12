import { useCallback } from "react";
import { VIEW_MAP, VIEW_ORDER } from "../flows/connect";
import { useOctantConnectStore } from "../store/store";

export function FlowContainer() {
  const activeView = useOctantConnectStore((state) => state.activeView);
  const setActiveView = useOctantConnectStore((state) => state.setActiveView);

  const onClickProgress = useCallback(() => {
    const currentViewIdx = VIEW_ORDER.indexOf(activeView);

    setActiveView(VIEW_ORDER[(currentViewIdx + 1) % VIEW_ORDER.length]);
  }, [activeView, setActiveView]);

  const ViewComponent = VIEW_MAP[activeView];

  return <ViewComponent onClickProgress={onClickProgress} />;
}
