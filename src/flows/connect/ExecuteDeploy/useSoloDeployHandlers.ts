import { type ButtonProps } from "@mui/material";
import { useCallback, useMemo } from "react";

import { useFetchManifestsAndDownload } from "../useFetchManifestsAndDownload";
import type { SoloDeployProps } from "./types";

function determineDownloadButtonProps(
  loading: boolean,
  hasDownloaded: boolean,
): {
  loading: boolean;
  text: string;
  variant: ButtonProps["variant"];
  color?: ButtonProps["color"];
} {
  if (loading) {
    return {
      loading,
      text: "Fetching manifests...",
      variant: "secondary",
    };
  }

  if (hasDownloaded) {
    return {
      loading,
      text: "Done",
      variant: "contained",
      color: "success",
    };
  }

  return {
    loading,
    text: "Download manifests",
    variant: "secondary",
  };
}

export function useSoloDeployHandlers({
  hasDownloaded,
  onDownloadFinish,
}: SoloDeployProps) {
  const { loading, fetchAndDownload } = useFetchManifestsAndDownload();

  const downloadButtonProps = useMemo(
    () => determineDownloadButtonProps(loading, hasDownloaded),
    [loading, hasDownloaded],
  );

  const handleDownloadButtonClick = useCallback(() => {
    fetchAndDownload(() => {}, onDownloadFinish);
  }, [fetchAndDownload, onDownloadFinish]);

  const returnValues = useMemo(
    () => ({
      ...downloadButtonProps,
      handleDownloadButtonClick,
    }),
    [downloadButtonProps, handleDownloadButtonClick],
  );

  return returnValues;
}
