import { AsyncButtonRow } from "@components/AsyncButtonRow";
import { Input } from "@components/formInputs/Input";
import { CenterColumn } from "@components/layout/CenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import { useOctantConnectStore } from "@store";
import { useShallow } from "zustand/shallow";
import { argoCd } from "../../services/api";

export function ConnectToCluster() {
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
      <AsyncButtonRow
        asyncFunction={argoCd.post}
        canAsync={!!(argoUrl.length && accountToken.length)}
        asyncButtonText={{
          text: "Check connection",
          loading: "Connecting to your cluster...",
          done: "Connected",
        }}
      />
    </CenterColumn>
  );
}
