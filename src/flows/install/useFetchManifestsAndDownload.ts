import { useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

import { useOctantConnectStore } from "@store";
import type { ManifestPayload } from "@types";
import { connections } from "../../services/api";

// TODO: Handle error state
export function useFetchManifestsAndDownload(isSideload?: boolean) {
  const [loading, setLoading] = useState(false);
  const form = useOctantConnectStore(useShallow((state) => state.form));

  const { connectionName, telemetryTypes } = form;

  const fetchAndDownload = useCallback(
    (onStart?: () => void, onEnd?: () => void) => {
      const manifestBody: ManifestPayload = {
        sourceType: "datadog",
        telemetryTypes,
        destinations: [
          {
            type: "datadog",
            integrationName: connectionName!,
          },
        ],
        deployment: {
          type: isSideload ? "argocd-sideload" : "argocd-manifests",
          integrationName: connectionName!,
        },
      };

      onStart?.();
      setLoading(true);
      void connections
        .generateManifests(connectionName!, manifestBody)
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

          const disposition = res.headers.get("Content-Disposition");
          const filename =
            disposition?.match(/filename="?([^"]+)"?/)?.[1] ??
            `${connectionName}-manifests.yaml`;

          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .finally(() => {
          setLoading(false);
          onEnd?.();
        });
    },
    [connectionName, telemetryTypes, isSideload],
  );

  const returnValues = useMemo(() => {
    return {
      loading,
      fetchAndDownload,
    };
  }, [loading, fetchAndDownload]);

  return returnValues;
}
