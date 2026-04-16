import { AsyncButtonRow } from "@components/AsyncButtonRow";
import { ConfigDrawer } from "@components/ConfigDrawer/ConfigDrawer";
import { CheckboxGroup } from "@components/formInputs/CheckboxGroup";
import { Input } from "@components/formInputs/Input";
import { Select } from "@components/formInputs/Select";
import { CenterColumn } from "@components/layout/CenterColumn";
import { RightColumn } from "@components/layout/RightColumn";
import { ViewTitle } from "@components/ViewTitle";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useOctantConnectStore } from "@store";
import type { ManifestPayload, TelemetryTypes } from "@types";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  type ArgoCdIntegrationBody,
  connections,
  type DatadogIntegrationBody,
  integrations,
} from "../../services/api";

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

export function DeployCollector() {
  const [focusedField, setFocusedField] = useState<string>();
  const { telemetryTypes, url, apiKey, connectionName, accountToken, argoUrl } =
    useOctantConnectStore(
      useShallow((state) => {
        // Provide default empty string values so React recognizes the Inputs as controlled
        const {
          telemetryTypes,
          url = "",
          apiKey = "",
          connectionName = "",
          accountToken,
          argoUrl,
        } = state.form;

        return {
          telemetryTypes,
          url,
          apiKey,
          connectionName,
          accountToken,
          argoUrl,
        };
      }),
    );
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  const handleBlur = () => setFocusedField(undefined);

  const handleDeployButtonClick = async () => {
    const connectionPayload: ManifestPayload = {
      sourceType: "datadog",
      telemetryTypes,
      destinations: [
        {
          type: "datadog",
          integrationName: connectionName,
        },
      ],
      deployment: {
        type: "argocd-sideload",
        integrationName: connectionName,
      },
    };
    const ddIntegrationPayload: DatadogIntegrationBody = {
      url: url,
      apiKey: apiKey,
    };
    const argoIntegrationPayload: ArgoCdIntegrationBody = {
      accountToken: accountToken!,
      apiUrl: argoUrl!,
    };

    await Promise.all([
      integrations.upsert("datadog", connectionName, ddIntegrationPayload),
      integrations.upsert("argocd", connectionName, argoIntegrationPayload),
    ]);

    await connections.upsert(connectionName, connectionPayload);
  };

  return (
    <>
      <CenterColumn>
        <ViewTitle
          title="Get ready to deploy the collector"
          description="Tell us how and where you would like to send your data from
                Datadog. Don’t worry, you can always modify this configuration
                later."
        />
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
        <AsyncButtonRow
          asyncFunction={handleDeployButtonClick}
          canAsync={
            !!(
              telemetryTypes.length &&
              url.length &&
              apiKey.length &&
              connectionName.length
            )
          }
          asyncButtonText={{
            text: "Deploy collector",
            done: "Done",
            loading: "Deploying...",
          }}
        />
      </CenterColumn>
      <RightColumn>
        <ConfigDrawer focusedField={focusedField} />
      </RightColumn>
    </>
  );
}
