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
import { useConnectStore } from "@store/connectStore";
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
import { DeployCollectorCopy as copy } from "../../copy/install/DeployCollector.copy";

const formSpec: FormFields = {
  telemetryTypes: [validateTelemetryTypesSelection],
  url: [validateRequired, validateUrlInput],
  apiKey: [validateRequired],
};

export function DeployCollector() {
  const [focusedField, setFocusedField] = useState<string>();
  const { telemetryTypes, url, apiKey, connectionName, namespace } =
    useConnectStore(
      useShallow((state) => {
        // Provide default empty string values so React recognizes the Inputs as controlled
        const {
          telemetryTypes,
          url = "",
          apiKey = "",
          connectionName,
          namespace,
        } = state.form;
        return {
          telemetryTypes,
          url,
          apiKey,
          connectionName,
          namespace,
        };
      }),
    );
  const setFormField = useConnectStore((state) => state.setFormField);

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
      });

      return true;
      // eslint-disable-next-line
    } catch (_) {
      return false;
    }
  };

  return (
    <>
      <FlowCenterColumn>
        <ViewTitle
          title={copy.header}
          description={copy.subheader}
        />
        <Typography variant="h6">{copy.sourceSection.title}</Typography>

        <Select
          label={copy.sourceSection.dropdown.label}
          selected={copy.sourceSection.dropdown.selected}
          size="small"
          disabled
          options={copy.sourceSection.dropdown.options}
          onChange={() => null}
        />

        <CheckboxGroup
          label={copy.sourceSection.datatypes.label}
          {...callbacks.telemetryTypes}
          options={copy.sourceSection.datatypes.options}
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
          To get the API key you'll need to log in to your Datadog account. To
          identify which Datadog site you're on, visit their{" "}
          {/* TODO: not sure if we should comment out
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
        <Select
          label={copy.destinationSection.dropdown.label}
          selected={copy.destinationSection.dropdown.selected}
          size="small"
          disabled
          options={copy.destinationSection.dropdown.options}
          onChange={() => null}
        />
        <Input
          value={url}
          onChange={(e) => setFormField("url", e.target.value)}
          {...callbacks.url}
          placeholder={copy.destinationSection.destinationUrl.placeholder}
          helperText={copy.destinationSection.destinationUrl.helperText}
          tooltip={copy.destinationSection.destinationUrl.tooltip}
          onFocus={() => setFocusedField("url")}
          onBlur={handleBlur}
        />
        <Input
          value={apiKey}
          onChange={(e) => setFormField("apiKey", e.target.value)}
          {...callbacks.apiKey}
          placeholder={copy.destinationSection.destinationApiKey.placeholder}
          onFocus={() => setFocusedField("apiKey")}
          onBlur={handleBlur}
          helperText={copy.destinationSection.destinationApiKey.helperText}
          tooltip={copy.destinationSection.destinationApiKey.tooltip}
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
