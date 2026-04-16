import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState, type Dispatch, type SetStateAction } from "react";
import "./DataFidelityCard.css";
import { DetailsCell } from "./DetailsCell";
import { FidelityCell } from "./FidelityCell";
import { TestAndValidateButton } from "./TestAndValidateButton";
import type { FidelityState } from "./types";

function createInitialDataFidelity() {
  return {
    receivingData: null,
    sendingData: null,
    dataIntegrity: null,
    details: null,
  };
}

const rowLabelsMap: Record<keyof FidelityState, string> = {
  receivingData: "Receiving data",
  sendingData: "Sending data",
  dataIntegrity: "Data integrity",
  details: "Details",
};

const ROW_ORDER: (keyof FidelityState)[] = [
  "receivingData",
  "sendingData",
  "dataIntegrity",
  "details",
];

export function DataFidelityCard({
  setIsValid,
}: {
  setIsValid: Dispatch<SetStateAction<boolean>>;
}) {
  const [dataFidelity, setDataFidelity] = useState<FidelityState>(
    createInitialDataFidelity,
  );

  return (
    <Card className="data-fidelity-card">
      <CardHeader
        className="data-fidelity-card-header"
        disableTypography
        title={
          <Stack
            className="data-fidelity-content-row"
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Typography>Connection</Typography>
            <Typography>Datadog</Typography>
          </Stack>
        }
      />
      <CardContent className="data-fidelity-card-content">
        {ROW_ORDER.map((key) => (
          <>
            <Divider key={`divider-${key}`} />
            <Stack
              className="data-fidelity-content-row"
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              key={`${key}-stack`}
            >
              <Typography>{rowLabelsMap[key]}</Typography>
              <Typography>
                {key === "details" ? (
                  <DetailsCell value={dataFidelity[key]} />
                ) : (
                  <FidelityCell value={dataFidelity[key]} />
                )}
              </Typography>
            </Stack>
          </>
        ))}
      </CardContent>
      <CardActions className="data-fidelity-card-actions">
        <Stack>
          <TestAndValidateButton
            setDataFidelity={setDataFidelity}
            setIsValid={setIsValid}
          />
        </Stack>
      </CardActions>
    </Card>
  );
}
