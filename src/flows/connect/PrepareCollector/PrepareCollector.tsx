import { CheckboxGroup } from "@components/formInputs/CheckboxGroup";
import { Input } from "@components/formInputs/Input";
import { Select } from "@components/formInputs/Select";
import { ViewContent } from "@components/ViewContent";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useOctantConnectStore } from "@store";
import type { BaseFlowViewProps, TelemetryTypes } from "@types";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { ConfigDrawer } from "./ConfigDrawer";

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

export function PrepareCollector({ onClickProgress }: BaseFlowViewProps) {
  const [focusedField, setFocusedField] = useState<string>();
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

  const handleBlur = () => setFocusedField(undefined);

  return (
    <ViewContent
      title="Get ready to deploy the collector"
      description="Tell us how and where you would like to send your data from
              Datadog. Don’t worry, you can always modify this configuration
              later."
      mainContent={
        <>
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
            onFocus={() => setFocusedField("telemetryTypes")}
            onBlur={handleBlur}
          />

          <Typography variant="h6">Destination</Typography>
          <Typography variant="body1">
            To get the API key you’ll need to log in to your Datadog account. To
            identify which Datadog site you’re on, visit their{" "}
            <Link
              href={
                "https://docs.datadoghq.com/getting_started/site/#access-the-datadog-site"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              docs
            </Link>{" "}
          </Typography>
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
            tooltip={"Log into your Datadog account to acquire the API key"}
            onFocus={() => setFocusedField("url")}
            onBlur={handleBlur}
          />
          <Input
            value={apiKey}
            onChange={(e) => setFormField("apiKey", e.target.value)}
            required
            placeholder="Datadog API key"
            onFocus={() => setFocusedField("apiKey")}
            onBlur={handleBlur}
          />

          <Typography variant="h6">Telemetry connection</Typography>

          <Input
            value={decodeURI(connectionName)}
            onChange={(e) =>
              setFormField("connectionName", encodeURI(e.target.value))
            }
            onFocus={() => setFocusedField("connectionName")}
            onBlur={handleBlur}
            required
            placeholder="Name this connection"
            helperText="We recommend providing a name that can be easily referenced later, e.g., datadog-io"
          />
        </>
      }
      onButtonClick={onClickProgress}
      buttonDisabled={!canClickNextButton}
      sidebarContent={<ConfigDrawer focusedField={focusedField} />}
    />
  );
}
