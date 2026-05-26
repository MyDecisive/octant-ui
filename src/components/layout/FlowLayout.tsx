import { ArgoInstallDialog } from "@components/ArgoInstallDialog";
import { FullscreenLoader } from "@components/FullscreenLoader";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useDetectProgress } from "@utils/initialization/useDetectProgress";
import "./FlowLayout.css";

export function FlowLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useDetectProgress();
  if (loading) {
    return <FullscreenLoader />;
  }
  return (
    <Box className="meta-container">
      <Paper className="layout-container">
        <Box className="column-container">
          <ArgoInstallDialog />
          {children}
        </Box>
      </Paper>
    </Box>
  );
}
