import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useOctantConnectStore } from "../store/store";
import type { TelemetryTypes } from "../types";
import CheckboxGroup from "./FormInputs/CheckboxGroup";
import { Input } from "./FormInputs/Input";
import { Select } from "./FormInputs/Select";

const dataSourceOptions: {
  label: string;
  value: string;
}[] = [{ label: "Datadog", value: "datadog" }];

const telemetryTypeOptions: {
  label: string;
  value: TelemetryTypes;
}[] = [
  {
    label: "Metrics",
    value: "metrics",
  },
  {
    label: "Logs",
    value: "logs",
  },
  {
    label: "Traces",
    value: "traces",
  },
];

export function PrepareCollector({
  onClickProgress,
}: {
  onClickProgress: () => void;
}) {
  const { telemetryTypes, url, apiKey, connectionName } = useOctantConnectStore(
    useShallow((state) => {
      // Provide default empty string values so React recognizes the Inputs as controlled
      const {
        telemetryTypes,
        url = "",
        apiKey = "",
        connectionName = "",
      } = state.form;

      return {
        telemetryTypes,

        url,
        apiKey,
        connectionName,
      };
    }),
  );
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  const canClickNextButton = useMemo(() => {
    return [telemetryTypes, url, apiKey, connectionName].every(
      (thing) => !!thing && thing.length > 0,
    );
  }, [telemetryTypes, url, apiKey, connectionName]);

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "466px auto", gap: 3 }}>
      <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "flex-start",
            alignSelf: "stretch",
          }}
        >
          <Typography variant="h5">
            Get ready to deploy the collector
          </Typography>
          <Typography variant="body2">
            Tell us how and where you would like to send your data from Datadog.
            Don’t worry, you can always modify this configuration later.
          </Typography>
        </Box>

        <Typography variant="h6">Source</Typography>

        <Select
          label="Data source"
          value="datadog"
          disabled
          options={dataSourceOptions}
          onChange={() => null}
        />

        <CheckboxGroup
          label="Which data types do you want to track?"
          options={telemetryTypeOptions}
          selected={telemetryTypes}
          onChange={(checked) =>
            setFormField("telemetryTypes", checked as TelemetryTypes[])
          }
        />

        <Typography variant="h6">Destination</Typography>
        <Select
          label="Data destination"
          value="datadog"
          disabled
          options={dataSourceOptions}
          onChange={() => null}
        />
        <Input
          value={url}
          onChange={(e) => setFormField("url", e.target.value)}
          required
          placeholder="Destination URL"
          tooltip="Log into your Datadog account to
acquire the API key"
        />
        <Input
          value={apiKey}
          onChange={(e) => setFormField("apiKey", e.target.value)}
          required
          placeholder="Datadog API key"
        />

        <Typography variant="h6">Telemetry connection</Typography>

        <Input
          value={connectionName}
          onChange={(e) => setFormField("connectionName", e.target.value)}
          required
          placeholder="Name this connection"
          helperText="We recommend providing a name that can be easily referenced later, e.g., datadog-io"
        />
        <Button
          variant="contained"
          size="small"
          type={"button"}
          onClick={onClickProgress}
          sx={{ alignSelf: "flex-start", textTransform: "none" }}
          disabled={!canClickNextButton}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
