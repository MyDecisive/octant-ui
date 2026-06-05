import { HealthWidget } from "@components/HealthWidget/HealthWidget";
import { ButtonRow } from "@components/layout/ButtonRow";
import { PageContainer } from "@components/layout/PageContainer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import "./SystemHealth.css";
import { useManageSystemHealth } from "./useManageSystemHealth";

export function SystemHealthPage() {
  const {
    healthWidgetProps,
    revalidate,
    showRevalidateButton,
    smarthubWidgetProps,
  } = useManageSystemHealth();

  return (
    <PageContainer>
      <Box className="system-health-content-container">
        <Stack gap={2} className="system-health-content">
          <Stack gap={1} className="system-health-widget-group">
            <HealthWidget
              containerClassName="system-health-widget"
              {...healthWidgetProps}
            />
            <ButtonRow>
              {showRevalidateButton && (
                <Button variant="contained" onClick={() => void revalidate()}>
                  Revalidate
                </Button>
              )}
            </ButtonRow>
          </Stack>
          <HealthWidget
            containerClassName="system-health-widget"
            {...smarthubWidgetProps}
          />
        </Stack>
      </Box>
    </PageContainer>
  );
}
