import { CodeSnippet } from "@components/CodeSnippet";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { SoloDeployProps } from "./types";
import { useSoloDeployHandlers } from "./useSoloDeployHandlers";

export function SoloDeploy(props: SoloDeployProps) {
  const { handleDownloadButtonClick, loading, variant, color, text } =
    useSoloDeployHandlers(props);
  return (
    <>
      <Typography
        variant="body2"
        className="execute-deploy-self-tab-header-description"
      >
        First download your manifest. Then place the app and collector files in
        their respective directories to keep your setup organized. For more
        help, check{" "}
        <Link
          className="execute-deploy-self-link"
          href={
            "https://argo-cd.readthedocs.io/en/latest/operator-manual/cluster-bootstrapping/#app-of-apps-pattern-alternative"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Argo Docs
          <ArrowOutwardRoundedIcon />
        </Link>
      </Typography>
      <Button
        className="execute-deploy-action-button"
        startIcon={<DownloadIcon />}
        onClick={handleDownloadButtonClick}
        size="small"
        color={color}
        variant={variant}
        loading={loading}
        disabled={loading}
        loadingPosition="start"
      >
        {text}
      </Button>

      <CodeSnippet
        // TODO: Update this code when we figure it out
        code={"dir. tree of Argo goes here"}
        copyButton={false}
      />
    </>
  );
}
