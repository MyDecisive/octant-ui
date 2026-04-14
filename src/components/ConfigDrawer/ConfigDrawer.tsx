import { ExpandConfig } from "@components/ExpandConfig";
import Stack from "@mui/material/Stack";
import { useOctantConnectStore } from "@store";
import { useShallow } from "zustand/shallow";
import {
  createUpdatedConfigLines,
  formKeyToConfigKeyMap,
} from "./collectorConfigUtils";
import "./ConfigDrawer.css";

interface ConfigDrawerProps {
  focusedField: string | undefined;
}

export function ConfigDrawer({ focusedField }: ConfigDrawerProps) {
  const { telemetryTypes, url, apiKey, connectionName } = useOctantConnectStore(
    useShallow((state) => {
      const { telemetryTypes, url, apiKey, connectionName } = state.form;

      return {
        telemetryTypes,
        url,
        apiKey,
        connectionName,
      };
    }),
  );

  const linesForRender = createUpdatedConfigLines(
    telemetryTypes,
    url,
    apiKey,
    connectionName,
  );

  return (
    <Stack className="config-drawer-container" gap={1} alignItems={"stretch"}>
      <ExpandConfig
        title={<pre className="config-drawer-line">Expand config view +</pre>}
        content={
          <>
            {linesForRender.map(([key, content], index) => {
              const highlight =
                key != undefined &&
                focusedField != undefined &&
                key ===
                  formKeyToConfigKeyMap[
                    focusedField as keyof typeof formKeyToConfigKeyMap
                  ];

              const className = `config-drawer-line${key != undefined ? ` ${key}` : ""}${highlight ? " highlight" : ""}`;
              return (
                <pre
                  key={`${content?.trim()}${key?.trim()}${index.toLocaleString()}-config-line`}
                  className={className}
                >
                  {content}
                </pre>
              );
            })}
          </>
        }
      />
    </Stack>
  );
}
