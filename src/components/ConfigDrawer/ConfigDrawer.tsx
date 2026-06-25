import type { TelemetryTypes } from "@app-types/enums";
import { Accordion } from "@components/Accordion";
import { CopyButton } from "@components/CopyButton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
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
  const [expanded, setExpanded] = useState(true);
  const codeContainerRef = useRef<HTMLDivElement>(null);
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
    if (!expanded || !codeContainerRef.current) {
      return;
    }

    const scrollConfigToBottom = () => {
      const scrollContainers = [
        codeContainerRef.current,
        codeContainerRef.current?.closest(".mdai-accordion-contents"),
        codeContainerRef.current?.closest(".mdai-accordion-contents-container"),
      ];

      scrollContainers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    };

    const frame = requestAnimationFrame(() => {
      scrollConfigToBottom();
    });
    const transitionFallback = window.setTimeout(scrollConfigToBottom, 250);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(transitionFallback);
    };
  }, [codeForCopy, expanded]);

  return (
    <Stack
      className={classNames("config-drawer-container", className)}
      gap={1}
      alignItems={"stretch"}
    >
      <Accordion
        className="config-drawer-accordion"
        contentContainerClassname="config-drawer-contents"
        hideExpandIcon
        title={<pre className="config-drawer-line">Expand config view +</pre>}
        expanded={expanded}
        onChange={(_, nextExpanded) => setExpanded(nextExpanded)}
        content={
          <Stack direction={"row"} className="config-drawer-code-container">
            <Box className="config-drawer-code" ref={codeContainerRef}>
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
            </Box>
            {expanded && (
              <CopyButton
                text={codeForCopy}
                ariaLabel="Copy config to clipboard"
              />
            )}
          </Stack>
        }
      />
    </Stack>
  );
}
