import { ConfigDrawer } from "@components/ConfigDrawer/ConfigDrawer";
import { CheckboxGroup } from "@components/formInputs/CheckboxGroup";
import { Input } from "@components/formInputs/Input";
import { Select } from "@components/formInputs/Select";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Typography from "@mui/material/Typography";
import type { FormFields, TelemetryTypes } from "@types";
import { useState, type ReactNode } from "react";
import { DeployCollectorCopy as copy } from "../copy/install/DeployCollector.copy";
import { useFormValidation } from "../fieldValidation/useFormValidation";
import { validateRequired } from "../fieldValidation/validateRequired";
import { validateTelemetryTypesSelection } from "../fieldValidation/validateTelemetryTypesSelection";
import { validateUrlInput } from "../fieldValidation/validateUrlInput";
import { isMaskedCollectorValue } from "../utils/maskedDDValues";

function validateOptionalUrlInput(value?: string) {
  if (!value || isMaskedCollectorValue(value)) {
    return undefined;
  }

  return validateUrlInput(value);
}

function validateOptionalDatadogApiKey(value?: string) {
  if (!value || isMaskedCollectorValue(value)) {
    return undefined;
  }

  if (value.length !== 32) {
    return "Datadog API key must be 32 characters";
  }

  return undefined;
}

function createFormSpec(
  apiKeyRequired: boolean,
  urlRequired: boolean,
): FormFields {
  return {
    telemetryTypes: [validateTelemetryTypesSelection],
    url: urlRequired
      ? [validateRequired, validateOptionalUrlInput]
      : [validateOptionalUrlInput],
    apiKey: apiKeyRequired
      ? [validateRequired, validateOptionalDatadogApiKey]
      : [validateOptionalDatadogApiKey],
  };
}

interface DeployCollectorFormProps {
  telemetryTypes: TelemetryTypes[];
  url: string;
  apiKey: string;
  connectionName?: string;
  onTelemetryTypesChange: (telemetryTypes: TelemetryTypes[]) => void;
  onUrlChange: (url: string) => void;
  onApiKeyChange: (apiKey: string) => void;
  urlPlaceholder?: string;
  apiKeyPlaceholder?: string;
  renderSubmitAction: (props: {
    canSubmit: boolean;
    validate: () => boolean;
  }) => ReactNode;
  apiKeyRequired?: boolean;
  urlRequired?: boolean;
  disabled?: boolean;
  submitEnabled?: boolean;
}

export function DeployCollectorForm({
  telemetryTypes,
  url,
  apiKey,
  connectionName,
  onTelemetryTypesChange,
  onUrlChange,
  onApiKeyChange,
  urlPlaceholder,
  apiKeyPlaceholder,
  renderSubmitAction,
  apiKeyRequired = true,
  urlRequired = true,
  disabled = false,
  submitEnabled = true,
}: DeployCollectorFormProps) {
  const [focusedField, setFocusedField] = useState<string>();
  const { callbacks, validateAll } = useFormValidation(
    createFormSpec(apiKeyRequired, urlRequired),
  );

  const handleBlur = () => setFocusedField(undefined);
  const hasRequiredValues =
    telemetryTypes.length > 0 &&
    (!urlRequired || !!url || !!urlPlaceholder) &&
    (!apiKeyRequired || !!apiKey || !!apiKeyPlaceholder);
  const canSubmit = hasRequiredValues && submitEnabled && !disabled;
  const validate = () => validateAll({ telemetryTypes, url, apiKey });

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

        <Select
          label={fields.source.label}
          selected={fields.source.selected}
          size="small"
          disabled
          options={copy.sourceSection.dropdown.options}
          onChange={() => null}
        />

        <CheckboxGroup
          label={fields.datatypes.label}
          {...callbacks.telemetryTypes}
          options={fields.datatypes.options}
          selected={telemetryTypes}
          onChange={(checked) =>
            onTelemetryTypesChange(checked as TelemetryTypes[])
          }
          onFocus={() => setFocusedField("telemetryTypes")}
          onBlur={handleBlur}
          disabled={disabled}
        />

        <Typography variant="h6">{copy.destinationSection.title}</Typography>

        <Typography variant="body1">
          {copy.destinationSection.subtitle}
        </Typography>

        <Select
          label={fields.destination.vendorDropdown.label}
          selected={fields.destination.vendorDropdown.selected}
          size="small"
          disabled
          options={fields.destination.vendorDropdown.options}
          onChange={() => null}
        />

        <Input
          value={url}
          {...callbacks.url}
          placeholder={urlPlaceholder ?? fields.destination.url.placeholder}
          helperText={fields.destination.url.helperText}
          onChange={(e) => onUrlChange(e.target.value)}
          onFocus={() => setFocusedField("url")}
          onBlur={handleBlur}
          disabled={disabled}
        />

        <Input
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          {...callbacks.apiKey}
          placeholder={
            apiKeyPlaceholder ?? fields.destination.apiKey.placeholder
          }
          onFocus={() => setFocusedField("apiKey")}
          onBlur={handleBlur}
          helperText={fields.destination.apiKey.helperText}
          tooltip={fields.destination.apiKey.tooltip}
          disabled={disabled}
        />
        {renderSubmitAction({ canSubmit, validate })}
      </FlowCenterColumn>
      <ConfigDrawer
        focusedField={focusedField}
        telemetryTypes={telemetryTypes}
        url={url}
        apiKey={apiKey}
        urlPlaceholder={urlPlaceholder}
        apiKeyPlaceholder={apiKeyPlaceholder}
        connectionName={connectionName}
        className="right-column"
      />
    </>
  );
}
