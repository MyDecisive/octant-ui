import { PageNav } from "@components/PageNav";
import { Timepicker } from "@components/Timepicker";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { TimeRange } from "@types";
import { useState } from "react";
import { useLocation } from "wouter";
import { ROUTES } from "../../constants/ROUTES";
import "./PageContainer.css";

const locationTitleMap = {
  [ROUTES.CLARITY]: "CLARITY",
  [ROUTES.CONNECTIONS]: "CONNECTIONS",
  [ROUTES.SMARTHUB]: "SMARTHUB",
};

export function PageContainer({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [selectedRange, setSelectedRange] = useState<TimeRange>("today");

  const showTimepicker = location === ROUTES.CLARITY;
  const title = locationTitleMap[location];
  return (
    <Box className="page-container">
      <PageNav />
      <Stack className="page-main-content-container">
        <Card className="page-header-container">
          <Stack
            justifyContent={showTimepicker ? "space-between" : "flex-start"}
            alignItems={"center"}
            direction={"row"}
          >
            <Typography variant="h2" className="page-title">
              {title}
            </Typography>
            {showTimepicker && (
              <Timepicker
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value as TimeRange)}
              />
            )}
          </Stack>
        </Card>
        {children}
      </Stack>
    </Box>
  );
}
