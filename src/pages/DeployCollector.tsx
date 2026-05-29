import { AsyncNextButton } from "@components/AsyncNextButton";
import { ConfigDrawer } from "@components/ConfigDrawer/ConfigDrawer";
import { CheckboxGroup } from "@components/formInputs/CheckboxGroup";
import { Input } from "@components/formInputs/Input";
import { Select } from "@components/formInputs/Select";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Typography from "@mui/material/Typography";
import { IntegrationType } from "@mydecisiveai/octant-client";
import { DeploymentType } from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import type { FormFields, TelemetryTypes } from "@types";
import { toMLTTypes } from "@utils/toMltTypes";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { DeployCollectorCopy as copy } from "../copy/install/DeployCollector.copy";
import { useFormValidation } from "../fieldValidation/useFormValidation";
import { validateRequired } from "../fieldValidation/validateRequired";
import { validateTelemetryTypesSelection } from "../fieldValidation/validateTelemetryTypesSelection";
import { validateUrlInput } from "../fieldValidation/validateUrlInput";
import { connectionServiceClient } from "../services/connection";
import { dDogServiceClient } from "../services/ddog";

const formSpec: FormFields = {
  telemetryTypes: [validateTelemetryTypesSelection],
  url: [validateRequired, validateUrlInput],
  apiKey: [validateRequired],
};

export function DeployCollector() {
  const [focusedField, setFocusedField] = useState<string>();
  const { telemetryTypes, url, apiKey, connectionName, namespace } =
    useInstallAndConnectStore(
      useShallow(
        ({
          // Provide default empty string values so React recognizes the Inputs as controlled
          telemetryTypes,
          url = "",
          apiKey = "",
          connectionName,
          namespace,
        }) => ({
          telemetryTypes,
          url,
          apiKey,
          connectionName,
          namespace,
        }),
      ),
    );
  const setFormField = useInstallAndConnectStore((state) => state.setFormField);

  const { callbacks, formIsValid: isFormValid } = useFormValidation(formSpec);

  const handleBlur = () => setFocusedField(undefined);

  const handleDeployButtonClick = async () => {
    try {
      await dDogServiceClient.saveDatadogIntegration({
        url,
        apiKey,
        name: connectionName,
      });

      await connectionServiceClient.createConnection({
        connectionData: {
          scope: {
            connectionName,
            namespace,
          },
          telemetryTypes: toMLTTypes(telemetryTypes),
          deployment: {
            type: DeploymentType.ARGO_SIDELOAD,
            integrationName: connectionName,
          },
          destinations: [
            {
              type: IntegrationType.DATADOG,
              integrationName: connectionName,
            },
          ],
        },
      });

      return true;
      // eslint-disable-next-line
    } catch (_) {
      // TODO: We need error feedback in this component
      return false;
    }
  };

  const fields = {
    source: {
      label: copy.sourceSection.dropdown.label,
      selected: "datadog",
    },
    datatypes: {
      label: copy.sourceSection.datatypes.label,
      options: [
        {
          // IC4-08
          label: "Logs",
          value: "logs",
        },
        {
          // IC4-09
          label: "Traces",
          value: "traces",
        },
      ],
    },
    destination: {
      vendorDropdown: {
        label: copy.destinationSection.vendorDropdownLabel,
        selected: "datadog",
        options: [
          {
            // IC4-13
            label: "Datadog",
            value: "datadog",
          },
        ],
      },
      url: {
        placeholder: copy.destinationSection.destinationUrl.placeholder,
        helperText: copy.destinationSection.destinationUrl.helperText,
      },
      apiKey: {
        placeholder: copy.destinationSection.destinationApiKey.placeholder,
        helperText: copy.destinationSection.destinationApiKey.helperText,
        tooltip: copy.destinationSection.destinationApiKey.tooltip,
      },
    },
  };

  return (
    <>
      <FlowCenterColumn>
        <ViewTitle title={copy.header} description={copy.subheader} />
        <Typography variant="h6">{copy.sourceSection.title}</Typography>

        {/* Source field */}
        <Select
          label={fields.source.label}
          selected={fields.source.selected}
          size="small"
          disabled
          options={copy.sourceSection.dropdown.options}
          onChange={() => null}
        />

        {/* Data Types Checkboxes */}
        <CheckboxGroup
          label={fields.datatypes.label}
          {...callbacks.telemetryTypes}
          options={fields.datatypes.options}
          selected={telemetryTypes}
          onChange={(checked) =>
            setFormField("telemetryTypes", checked as TelemetryTypes[])
          }
          onFocus={() => setFocusedField("telemetryTypes")}
          onBlur={handleBlur}
        />

        <Typography variant="h6">{copy.destinationSection.title}</Typography>

        <Typography variant="body1">
          {copy.destinationSection.subtitle}
          {/* TODO: not sure if we should comment out
          To get the API key you'll need to log in to your Datadog account. To
          identify which Datadog site you're on, visit their{" "}
          <Link
            href={
              "https://docs.datadoghq.com/getting_started/site/#access-the-datadog-site"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            docs
          </Link>{" "} */}
        </Typography>
        {/* Source field */}

        {/* Vendor Dropdown */}
        <Select
          label={fields.destination.vendorDropdown.label}
          selected={fields.destination.vendorDropdown.selected}
          size="small"
          disabled
          options={fields.destination.vendorDropdown.options}
          onChange={() => null}
        />

        {/* Destination Url */}
        <Input
          value={url}
          {...callbacks.url}
          placeholder={fields.destination.url.placeholder}
          helperText={fields.destination.url.helperText}
          onChange={(e) => setFormField("url", e.target.value)}
          onFocus={() => setFocusedField("url")}
          onBlur={handleBlur}
        />

        {/* Destination Api Key */}
        <Input
          value={apiKey}
          onChange={(e) => setFormField("apiKey", e.target.value)}
          {...callbacks.apiKey}
          placeholder={fields.destination.apiKey.placeholder}
          onFocus={() => setFocusedField("apiKey")}
          onBlur={handleBlur}
          helperText={fields.destination.apiKey.helperText}
          tooltip={fields.destination.apiKey.tooltip}
        />
        <AsyncNextButton
          asyncFunction={handleDeployButtonClick}
          canAsync={isFormValid}
          text={copy.cta.initial}
          loadingText={copy.cta.activated}
        />
      </FlowCenterColumn>
      <ConfigDrawer focusedField={focusedField} className="right-column" />
    </>
  );
}
