import { useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

import { useOctantConnectStore } from "@store";
import {
  createManifestRequest,
  loadInstallManifest,
} from "./services/installService";

// TODO: Handle error state
export function useFetchManifestsAndDownload(isSideload?: boolean) {
  const [loading, setLoading] = useState(false);
  const form = useOctantConnectStore(useShallow((state) => state.form));

  const { connectionName, deployMethod, namespace, telemetryTypes } = form;

  const fetchAndDownload = useCallback(
    (onStart?: () => void, onEnd?: () => void) => {
      const manifestRequest = createManifestRequest({
        namespace,
        connectionName: connectionName!,
        telemetryTypes,
        deployMethod: isSideload ? "argocd-sideload" : deployMethod,
      });

      onStart?.();
      setLoading(true);
      void loadInstallManifest(manifestRequest)
        .then(({ blob, filename }) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        })
        .finally(() => {
          setLoading(false);
          onEnd?.();
        });
    },
    [connectionName, deployMethod, namespace, telemetryTypes, isSideload],
  );

  const returnValues = useMemo(() => {
    return {
      loading,
      fetchAndDownload,
    };
  }, [loading, fetchAndDownload]);

  return returnValues;
}
