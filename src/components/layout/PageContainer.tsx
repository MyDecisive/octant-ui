import { Select, type SelectOption } from "@components/formInputs/Select";
import { PageNav } from "@components/PageNav";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Timeframe } from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarityStore";
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
  const { namespace, connectionName } = useOctantStore(
    useShallow((store) => {
      const { namespace, connectionName } = store;

      return { namespace, connectionName };
    }),
  );
  const { setState: setClarityState, timeRange } = useClarityStore(
    useShallow((state) => ({
      setState: state.setState,
      timeRange: state.timeRange,
    })),
  );
  const selectedTimeRange = String(timeRange);
  const [location] = useLocation();

  const [pickerOptions, setPickerOptions] = useState<SelectOption[]>([]);

  const setSelectedRange = (newRange: string) => {
    setClarityState("timeRange", Number(newRange) as Timeframe);
  };

  const showTimepicker = location === ROUTES.CLARITY;
  const title = locationTitleMap[location];

  useEffect(() => {
    let ignore = false;

    async function fetchPickerOptions() {
      if (!connectionName || !namespace) {
        setPickerOptions([]);
        setClarityState("hasLogTimeframeData", undefined);
        setClarityState("hasTraceTimeframeData", undefined);
        return;
      }

      try {
        const { statuses, trace, log } =
          await timeframeServiceClient.timeframeStatus({
            namespace,
            connectionName,
          });

        const options = timeframeToPickerOptions(statuses);

        if (!ignore) {
          setClarityState("hasLogTimeframeData", log);
          setClarityState("hasTraceTimeframeData", trace);
          setPickerOptions(options);
        }
      } catch {
        if (!ignore) {
          setPickerOptions([]);
          setClarityState("hasLogTimeframeData", undefined);
          setClarityState("hasTraceTimeframeData", undefined);
        }
      }
    }

    void fetchPickerOptions();

    return () => {
      ignore = true;
    };
  }, [connectionName, namespace, setClarityState]);

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
                selected={selectedTimeRange}
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
