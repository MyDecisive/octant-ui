import { connections } from "../../services/api";

// TODO: Handle error state
export function fetchManifests(
  connectionName: string,
  onStart?: () => void,
  onEnd?: () => void,
) {
  onStart?.();
  void connections
    .getManifests(connectionName)
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${connectionName}-manifests.zip`;
      a.click();
      URL.revokeObjectURL(url);
    })
    .finally(() => {
      onEnd?.();
    });
}
