import { HealthWidget } from "@components/HealthWidget/HealthWidget";
import { ButtonRow } from "@components/layout/ButtonRow";
import { PageContainer } from "@components/layout/PageContainer";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useManageSystemHealth } from "./useManageSystemHealth";
import "./SystemHealth.css";

export function SystemHealthPage() {
  const {
    healthWidgetProps,
    revalidate,
    showRevalidateButton,
    smarthubWidgetProps,
  } = useManageSystemHealth();

  return (
    <PageContainer>
      <Stack gap={2} className="system-health-content-container">
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
    </PageContainer>
  );
}
