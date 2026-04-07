export interface ArgoDeployProps {
  hasDeployed: boolean;
  onDeployFinish: () => void;
}

export interface SoloDeployProps {
  hasDownloaded: boolean;
  onDownloadFinish: () => void;
}
