import { useCallback, useMemo, useState } from "react";

type TabValues = "argocd" | "solo";

export function useExecuteDeployHandlers() {
  const [activeTab, setActiveTab] = useState<TabValues>("argocd");
  const [hasDeployed, setHasDeployed] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const handleTabChange = useCallback(
    (_e: React.SyntheticEvent, tab: TabValues) => {
      setActiveTab(tab);
    },
    [],
  );

  const returnValues = useMemo(
    () => ({
      handleTabChange,
      activeTab,
      hasDeployed,
      hasDownloaded,
      onDeployFinish: () => setHasDeployed(true),
      onDownloadFinish: () => setHasDownloaded(true),
    }),
    [handleTabChange, activeTab, hasDeployed, hasDownloaded],
  );

  return returnValues;
}
