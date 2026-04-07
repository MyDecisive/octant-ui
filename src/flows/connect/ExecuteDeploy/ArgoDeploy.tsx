import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import "./ExecuteDeploy.css";
import type { ArgoDeployProps } from "./types";
import { useArgoDeployHandlers } from "./useArgoDeployHandlers";

export function ArgoDeploy(props: ArgoDeployProps) {
  const {
    handleDeployButtonClick,
    loading,
    variant,
    color,
    text,
    deployError,
  } = useArgoDeployHandlers(props);

  return (
    <>
      <Stack gap={0.5}>
        <Stack
          gap={0.5}
          className="execute-deploy-argo-tab-header-title-container"
        >
          <WarningAmberOutlinedIcon color="warning" />
          <Typography variant="h6">Updating your ArgoCD server</Typography>
        </Stack>
        <Typography
          variant="body2"
          className="execute-deploy-argo-tab-header-description"
        >
          We’re about to force update your Argo CD server with this collector.
          Don’t worry, we’ll provide the raw manifests for version control
          later.
        </Typography>
      </Stack>
      <Button
        className="execute-deploy-action-button"
        onClick={handleDeployButtonClick}
        size="small"
        loadingPosition="start"
        loading={loading}
        disabled={loading}
        variant={variant}
        color={color}
      >
        {text}
      </Button>
      {deployError && (
        <Typography variant="body2" color="error">
          Deploy failed: {deployError}
        </Typography>
      )}
    </>
  );
}
