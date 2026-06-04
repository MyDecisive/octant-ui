import { Accordion } from "@components/Accordion";
import { CopyButton } from "@components/CopyButton";
import Stack from "@mui/material/Stack";
import type { TelemetryTypes } from "@types";
import classNames from "classnames";
import { useEffect } from "react";
import {
  createUpdatedConfigLines,
  formKeyToConfigKeyMap,
} from "./collectorConfigUtils";
import "./ConfigDrawer.css";

interface ConfigDrawerProps {
  focusedField: string | undefined;
  telemetryTypes: TelemetryTypes[];
  url?: string;
  apiKey?: string;
  urlPlaceholder?: string;
  apiKeyPlaceholder?: string;
  connectionName?: string;
  className?: string;
}

export function ConfigDrawer({
  focusedField,
  telemetryTypes,
  url,
  apiKey,
  urlPlaceholder,
  apiKeyPlaceholder,
  connectionName,
  className,
}: ConfigDrawerProps) {
  const linesForRender = createUpdatedConfigLines(
    telemetryTypes,
    url,
    apiKey,
    connectionName,
    urlPlaceholder,
    apiKeyPlaceholder,
  );
  const codeForCopy = linesForRender.map(([, content]) => content).join("\n");

  useEffect(() => {
    const lastCodeLine = document.getElementById("last-line");
    if (lastCodeLine) {
      lastCodeLine.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <Stack
      className={classNames("config-drawer-container", className)}
      gap={1}
      alignItems={"stretch"}
    >
      <Accordion
        className="config-drawer-accordion"
        hideExpandIcon
        title={<pre className="config-drawer-line">Expand config view +</pre>}
        defaultExpanded
        content={
          <>
            <CopyButton
              text={codeForCopy}
              ariaLabel="Copy config to clipboard"
            />
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
                  id={
                    index === linesForRender.length - 1
                      ? "last-line"
                      : undefined
                  }
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
