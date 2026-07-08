import type { TelemetryTypes } from "@app-types/enums";
import type { FormFields } from "@app-types/validation";
import { ConfigDrawer } from "@components/ConfigDrawer/ConfigDrawer";
import { CheckboxGroup } from "@components/formInputs/CheckboxGroup";
import { Input } from "@components/formInputs/Input";
import { Select } from "@components/formInputs/Select";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Typography from "@mui/material/Typography";
import { useState, type ReactNode } from "react";
import { DeployCollectorCopy as copy } from "../copy/install/DeployCollector.copy";
import { useFormValidation } from "../fieldValidation/useFormValidation";
import { validateRequired } from "../fieldValidation/validateRequired";
import { validateTelemetryTypesSelection } from "../fieldValidation/validateTelemetryTypesSelection";
import { validateUrlInput } from "../fieldValidation/validateUrlInput";
import { isMaskedValue } from "../utils/maskedValues";

function validateOptionalUrlInput(value?: string) {
  if (!value || isMaskedValue(value)) {
    return undefined;
  }

  return validateUrlInput(value);
}

function validateOptionalDatadogApiKey(value?: string) {
  if (!value || isMaskedValue(value)) {
    return undefined;
  }

  return undefined;
}

function createFormSpec(
  apiKeyRequired: boolean,
  siteHostRequired: boolean,
): FormFields {
  return {
    telemetryTypes: [validateTelemetryTypesSelection],
    siteHost: siteHostRequired
      ? [validateRequired, validateOptionalUrlInput]
      : [validateOptionalUrlInput],
    apiKey: apiKeyRequired
      ? [validateRequired, validateOptionalDatadogApiKey]
      : [validateOptionalDatadogApiKey],
  };
}

interface DeployCollectorFormProps {
  telemetryTypes: TelemetryTypes[];
  siteHost: string;
  apiKey: string;
  connectionName?: string;
  onTelemetryTypesChange: (telemetryTypes: TelemetryTypes[]) => void;
  onSiteHostChange: (siteHost: string) => void;
  onApiKeyChange: (apiKey: string) => void;
  siteHostPlaceholder?: string;
  apiKeyPlaceholder?: string;
  renderSubmitAction: (props: {
    canSubmit: boolean;
    validate: () => boolean;
  }) => ReactNode;
  apiKeyRequired?: boolean;
  siteHostRequired?: boolean;
  disabled?: boolean;
  submitEnabled?: boolean;
}

export function DeployCollectorForm({
  telemetryTypes,
  siteHost,
  apiKey,
  connectionName,
  onTelemetryTypesChange,
  onSiteHostChange,
  onApiKeyChange,
  siteHostPlaceholder,
  apiKeyPlaceholder,
  renderSubmitAction,
  apiKeyRequired = true,
  siteHostRequired = true,
  disabled = false,
  submitEnabled = true,
}: DeployCollectorFormProps) {
  const [focusedField, setFocusedField] = useState<string>();
  const { callbacks, validateAll } = useFormValidation(
    createFormSpec(apiKeyRequired, siteHostRequired),
  );

  const handleBlur = () => setFocusedField(undefined);
  const hasRequiredValues =
    telemetryTypes.length > 0 &&
    (!siteHostRequired || !!siteHost || !!siteHostPlaceholder) &&
    (!apiKeyRequired || !!apiKey || !!apiKeyPlaceholder);
  const canSubmit = hasRequiredValues && submitEnabled && !disabled;
  const validate = () => validateAll({ telemetryTypes, siteHost, apiKey });

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
      siteHost: {
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
          value={siteHost}
          {...callbacks.siteHost}
          placeholder={
            siteHostPlaceholder ?? fields.destination.siteHost.placeholder
          }
          helperText={fields.destination.siteHost.helperText}
          onChange={(e) => onSiteHostChange(e.target.value)}
          onFocus={() => setFocusedField("siteHost")}
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
        siteHost={siteHost}
        apiKey={apiKey}
        siteHostPlaceholder={siteHostPlaceholder}
        apiKeyPlaceholder={apiKeyPlaceholder}
        connectionName={connectionName}
        className="right-column"
      />
    </>
  );
}
