import { PageNav } from "@components/PageNav";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useLocation } from "wouter";
import { ROUTES } from "../../constants/ROUTES";
import "./PageContainer.css";

const locationTitleMap = {
  [ROUTES.CLARITY]: "Clarity",
  [ROUTES.SYSTEMHEALTH]: "System Health",
  [ROUTES.SETTINGS]: "Settings",
  [ROUTES.SUPPORT]: "Support",
};

interface PageContainerProps {
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function PageContainer({ children, headerActions }: PageContainerProps) {
  const [location] = useLocation();
  const title = locationTitleMap[location];

  return (
    <Box className="page-container">
      <PageNav />
      <Stack className="page-main-content-container">
        <Stack direction={"row"} className="page-header-container">
          <Typography variant="h2" className="page-title">
            {title}
          </Typography>
          {headerActions}
        </Stack>
        <Box className="page-content-container">{children}</Box>
      </Stack>
    </Box>
  );
}
