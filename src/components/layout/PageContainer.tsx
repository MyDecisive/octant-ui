import { PageNav } from "@components/PageNav";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useLocation } from "wouter";
import { ROUTES } from "../../constants/ROUTES";
import "./PageContainer.css";

const locationTitleMap = {
  [ROUTES.CLARITY]: "CLARITY",
  [ROUTES.CONNECTIONS]: "CONNECTIONS",
  [ROUTES.SMARTHUB]: "SMARTHUB",
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
        <Card className="page-header-container">
          <Stack
            className="page-header-content"
            justifyContent={"space-between"}
            alignItems={"center"}
            direction={"row"}
          >
            <Typography variant="h2" className="page-title">
              {title}
            </Typography>
            {headerActions}
          </Stack>
        </Card>
        {children}
      </Stack>
    </Box>
  );
}
