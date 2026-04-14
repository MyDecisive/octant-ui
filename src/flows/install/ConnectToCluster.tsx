import { Input } from "@components/formInputs/Input";
import { ButtonRow } from "@components/layout/ButtonRow";
import { CenterColumn } from "@components/layout/CenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Button, { type ButtonProps } from "@mui/material/Button";
import { useOctantConnectStore } from "@store";
import type { BaseFlowViewProps } from "@types";
import { useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { argoCd } from "../../services/api";

export function ConnectToCluster({ onClickProgress }: BaseFlowViewProps) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { argoUrl, accountToken } = useOctantConnectStore(
    useShallow((state) => {
      // Provide default empty string values so React recognizes the Inputs as controlled
      const { deployMethod, argoUrl = "", accountToken = "" } = state.form;

      return {
        deployMethod,
        argoUrl,
        accountToken,
      };
    }),
  );
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  const handleArgoConnection = useCallback(() => {
    setLoading(true);
    void argoCd.post().then(() => {
      setConnected(true);
      setLoading(false);
    });
  }, []);

  const connectButtonProps = useMemo(
    () => getConnectButtonProps(argoUrl, accountToken, loading, connected),
    [argoUrl, accountToken, loading, connected],
  );
  console.log("connectButtonProps ", connectButtonProps);
  const nextButtonProps = getNextButtonProps(connected);

  return (
    <CenterColumn>
      <ViewTitle
        title="Connect to your Kubernetes Cluster"
        description="<Provide ArgoCD somethings and validate connection>"
      />

      <Input
        value={argoUrl}
        onChange={(e) => setFormField("argoUrl", e.target.value)}
        required
        placeholder="Target Argo URL"
        tooltip={
          "Target Argo URL is where these changes will live in your version control platform. Please make sure this Argo URL changes as your promote this change through your SDLC environments."
        }
      />
      <Input
        value={accountToken}
        onChange={(e) => setFormField("accountToken", e.target.value)}
        required
        placeholder="Argo account token?"
      />
      <ButtonRow>
        <Button
          variant="contained"
          size="small"
          type={"button"}
          onClick={handleArgoConnection}
          disabled={connectButtonProps.disabled}
          color={connectButtonProps.color}
          loading={connectButtonProps.loading}
        >
          {connectButtonProps.text}
        </Button>
        <Button
          variant="contained"
          size="small"
          type={"button"}
          onClick={onClickProgress}
          disabled={nextButtonProps.disabled}
          color={nextButtonProps.color}
        >
          Next
        </Button>
      </ButtonRow>
    </CenterColumn>
  );
}

function getConnectButtonProps(
  argoUrl: string,
  argoToken: string,
  loading: boolean,
  connected: boolean,
): {
  text: string;
  disabled: boolean;
  loading: boolean;
  color: ButtonProps["color"];
} {
  console.log({ argoUrl, argoToken, loading, connected });
  if (loading) {
    return {
      text: "Connecting to your cluster...",
      disabled: true,
      loading: false,
      color: "secondary",
    };
  }
  if (connected) {
    return {
      text: "Connected",
      disabled: true,
      loading: false,
      color: "success",
    };
  }
  if (argoUrl.length && argoToken.length) {
    return {
      text: "Check connection",
      disabled: false,
      loading: false,
      color: "primary",
    };
  }
  return {
    text: "Check connection",
    disabled: true,
    loading: false,
    color: "secondary",
  };
}

function getNextButtonProps(connected: boolean): {
  disabled: boolean;
  color: ButtonProps["color"];
} {
  if (connected) {
    return {
      disabled: false,
      color: "primary",
    };
  }
  return {
    disabled: true,
    color: "secondary",
  };
}
