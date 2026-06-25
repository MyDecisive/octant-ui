import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { TelemetryTypes } from "@app-types/enums";
import {
  DeploymentType,
  ManifestOutFormat,
} from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";
import { toMLTTypes } from "@utils/toMltTypes";
import { connectionServiceClient } from "../services/connection";

function getManifestBlobPart(data: Uint8Array | string) {
  const bytes =
    typeof data === "string"
      ? Uint8Array.from(atob(data), (char) => char.charCodeAt(0))
      : new Uint8Array(data);

  return bytes.buffer;
}

interface ManifestDownloadParams {
  connectionName?: string;
  namespace?: string;
  telemetryTypes: TelemetryTypes[];
  mdaiVersion?: string;
}

// TODO: [UX] Handle error state
export function useFetchManifestsAndDownload({
  connectionName,
  telemetryTypes,
  mdaiVersion,
  namespace,
}: ManifestDownloadParams) {
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAndDownload = useCallback(
    async (onStart?: () => void, onEnd?: () => void) => {
      if (!connectionName || !namespace) return;

      onStart?.();
      setLoading(true);

      try {
        const chunks: BlobPart[] = [];
        let mimeType = "";

        for await (const res of connectionServiceClient.generateManifests({
          scope: {
            connectionName,
            namespace,
          },
          telemetryTypes: toMLTTypes(telemetryTypes),
          format: ManifestOutFormat.YAML,
          deploymentType: DeploymentType.ARGO_SIDELOAD,
          mdaiVersion: mdaiVersion ?? "0.10.0",
        })) {
          chunks.push(getManifestBlobPart(res.data));
          mimeType = res.type;
        }

        const blob = new Blob(chunks, { type: mimeType });
        const extension = mimeType.includes("zip") ? "zip" : "yaml";
        const filename = `${connectionName}-manifests.${extension}`;
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        timeoutRef.current = setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
        }, 60_000);
      } finally {
        setLoading(false);
        onEnd?.();
      }
    },
    [connectionName, telemetryTypes, namespace, mdaiVersion],
  );

  const returnValues = useMemo(() => {
    return {
      loading,
      fetchAndDownload,
    };
  }, [loading, fetchAndDownload]);

  useEffect(() => {
    if (timeoutRef.current) {
      return () => {
        clearTimeout(timeoutRef.current!);
      };
    }
  }, []);
  return returnValues;
}
