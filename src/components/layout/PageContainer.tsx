import { Select, type SelectOption } from "@components/formInputs/Select";
import { PageNav } from "@components/PageNav";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useOctantStore } from "@store/octantStore";
import { timeframeToPickerOptions } from "@utils/timeframeToPickerOptions";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";
import { ROUTES } from "../../constants/ROUTES";
import { timeframeServiceClient } from "../../services/timeframe";
import "./PageContainer.css";

const locationTitleMap = {
  [ROUTES.CLARITY]: "CLARITY",
  [ROUTES.CONNECTIONS]: "CONNECTIONS",
  [ROUTES.SMARTHUB]: "SMARTHUB",
};

export function PageContainer({ children }: { children: React.ReactNode }) {
  const { timeRange, namespace, connectionName } = useOctantStore(
    useShallow((store) => {
      const { timeRange, namespace, connectionName } = store;

      return { timeRange: String(timeRange), namespace, connectionName };
    }),
  );

  const setState = useOctantStore((store) => store.setState);
  const [location] = useLocation();

  const [pickerOptions, setPickerOptions] = useState<SelectOption[]>([]);

  const setSelectedRange = (newRange: string) =>
    setState("timeRange", parseInt(newRange));

  const showTimepicker = location === ROUTES.CLARITY;
  const title = locationTitleMap[location];

  useEffect(() => {
    if (pickerOptions.length < 1) {
      async function fetchPickerOptions() {
        const {
          statuses,
          // TODO: figure out how best to use these flags
          // trace,
          // log,
        } = await timeframeServiceClient.timeframeStatus({
          namespace,
          connectionName,
        });

        const options = timeframeToPickerOptions(statuses);

        setPickerOptions(options);
      }

      void fetchPickerOptions();
    }
  }, [pickerOptions, namespace, connectionName]);

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
              <Select
                selected={timeRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                options={pickerOptions}
                className="mdai-timepicker"
                label="Time range"
                size="small"
              />
            )}
          </Stack>
        </Card>
        {children}
      </Stack>
    </Box>
  );
}
