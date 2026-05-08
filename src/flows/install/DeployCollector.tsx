import { AsyncNextButton } from "@components/AsyncNextButton";
import { ConfigDrawer } from "@components/ConfigDrawer/ConfigDrawer";
import { CheckboxGroup } from "@components/formInputs/CheckboxGroup";
import { Input } from "@components/formInputs/Input";
import { Select } from "@components/formInputs/Select";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useOctantConnectStore } from "@store";
import type { FormFields, TelemetryTypes } from "@types";
import { toMLTTypes } from "@utils/toMltTypes";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useFormValidation } from "../../fieldValidation/useFormValidation";
import { validateRequired } from "../../fieldValidation/validateRequired";
import { validateTelemetryTypesSelection } from "../../fieldValidation/validateTelemetryTypesSelection";
import { validateUrlInput } from "../../fieldValidation/validateUrlInput";
import { connectionServiceClient } from "../../services/connection";
import { dDogServiceClient } from "../../services/ddog";

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

const formSpec: FormFields = {
  telemetryTypes: [validateTelemetryTypesSelection],
  url: [validateRequired, validateUrlInput],
  apiKey: [validateRequired],
};

function getManifestBlobPart(data: Uint8Array | string) {
  const bytes =
    typeof data === "string"
      ? Uint8Array.from(atob(data), (char) => char.charCodeAt(0))
      : new Uint8Array(data);

  return bytes.buffer;
}

export function DeployCollector() {
  const [focusedField, setFocusedField] = useState<string>();
  const {
    telemetryTypes,
    url,
    apiKey,
    connectionName,
    namespace,
    mdaiVersion,
  } = useOctantConnectStore(
    useShallow((state) => {
      // Provide default empty string values so React recognizes the Inputs as controlled
      const {
        telemetryTypes,
        url = "",
        apiKey = "",
        connectionName,
        namespace,
        mdaiVersion,
      } = state.form;
      return {
        telemetryTypes,
        url,
        apiKey,
        connectionName,
        namespace,
        mdaiVersion,
      };
    }),
  );
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  const { callbacks, formIsValid: isFormValid } = useFormValidation(formSpec);

  const handleBlur = () => setFocusedField(undefined);

  const handleDeployButtonClick = async () => {
    try {
      await dDogServiceClient.saveDatadogIntegration({
        url,
        apiKey,
        name: connectionName,
      });

      const chunks: BlobPart[] = [];
      let mimeType = "";

      for await (const res of connectionServiceClient.generateManifests({
        scope: {
          connectionName,
          namespace,
        },
        telemetryTypes: toMLTTypes(telemetryTypes),
        format: 2, // yaml
        deploymentType: 1, // sideload
        mdaiVersion,
      })) {
        chunks.push(getManifestBlobPart(res.data));
        mimeType = res.type;
      }

      const blob = new Blob(chunks, { type: mimeType });
      const extension = mimeType.includes("zip") ? "zip" : "yaml";
      const filename = `${connectionName}-manifests.${extension}`;
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);
      return true;
    } catch (error) {
      console.error("Failed to generate and download manifests", error);
      return false;
    }
  };

  return (
    <>
      <FlowCenterColumn>
        <ViewTitle
          title="Get ready to deploy the collector"
          description="Tell us how and where you would like to send your data from
                Datadog. Don’t worry, you can always modify this configuration
                later."
        />
        <Typography variant="h6">Source</Typography>

        <Select
          label="Data source"
          selected="datadog"
          disabled
          options={dataSourceOptions}
          onChange={() => null}
        />

        <CheckboxGroup
          label="Which data types do you want to track?"
          {...callbacks.telemetryTypes}
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
          selected="datadog"
          disabled
          options={dataSourceOptions}
          onChange={() => null}
        />
        <Input
          value={url}
          onChange={(e) => setFormField("url", e.target.value)}
          {...callbacks.url}
          placeholder="Destination URL"
          tooltip={"Log into your Datadog account to acquire the API key"}
          onFocus={() => setFocusedField("url")}
          onBlur={handleBlur}
        />
        <Input
          value={apiKey}
          onChange={(e) => setFormField("apiKey", e.target.value)}
          {...callbacks.apiKey}
          placeholder="Datadog API key"
          onFocus={() => setFocusedField("apiKey")}
          onBlur={handleBlur}
        />
        <AsyncNextButton
          asyncFunction={handleDeployButtonClick}
          canAsync={isFormValid}
          text="Deploy"
          loadingText="Deploying"
        />
      </FlowCenterColumn>
      <ConfigDrawer focusedField={focusedField} className="right-column" />
    </>
  );
}
