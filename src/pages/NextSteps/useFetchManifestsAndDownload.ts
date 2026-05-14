import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";

import {
  DeploymentType,
  ManifestOutFormat,
} from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { toMLTTypes } from "@utils/toMltTypes";
import { connectionServiceClient } from "../../services/connection";

function getManifestBlobPart(data: Uint8Array | string) {
  const bytes =
    typeof data === "string"
      ? Uint8Array.from(atob(data), (char) => char.charCodeAt(0))
      : new Uint8Array(data);

  return bytes.buffer;
}

// TODO: Handle error state
export function useFetchManifestsAndDownload() {
  const [loading, setLoading] = useState(false);
  const { connectionName, telemetryTypes, mdaiVersion, namespace } =
    useInstallAndConnectStore(
      useShallow(
        ({ connectionName, telemetryTypes, mdaiVersion, namespace }) => ({
          connectionName,
          telemetryTypes,
          mdaiVersion,
          namespace,
        }),
      ),
    );

  const timeoutRef = useRef<number | null>(null);

  const fetchAndDownload = useCallback(
    async (onStart?: () => void, onEnd?: () => void) => {
      onStart?.();
      setLoading(true);

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
        mdaiVersion,
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
      await new Promise<void>((resolve) => {
        timeoutRef.current = setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
          document.body.removeChild(a);
          resolve();
        }, 60_000);
      });
      setLoading(false);
      onEnd?.();
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
