import { CodeSnippet } from "@components/CodeSnippet";
import { CenterColumn } from "@components/layout/CenterColumn";
import { SimpleCard } from "@components/SimpleCard";
import { ViewTitle } from "@components/ViewTitle";
import { useOctantConnectStore } from "@store";
import { useFetchManifestsAndDownload } from "./useFetchManifestsAndDownload";

export function NextSteps() {
  const connectionName = useOctantConnectStore(
    (state) => state.form.connectionName,
  );

  const { loading, fetchAndDownload } = useFetchManifestsAndDownload();

  const handleDownloadManifestsClick = () => fetchAndDownload();

  return (
    <CenterColumn>
      <ViewTitle
        title="Next steps"
        description="You’re all set. When you’re ready, feel free to check out our labs catalog or manage your Argo changes."
      />

      <SimpleCard
        title="Try out one of our solutions"
        description="Play around with our installable labs."
        link={{
          text: "See our docs",
          href: "https://docs.mydecisive.ai/",
        }}
      />
      <SimpleCard
        title="Migrate Smarthub into production"
        description="Ready to go live? Follow our step-by-step guide to safely migrate Smarthub from your current environment into production."
        link={{
          text: "See our docs",
          href: "https://docs.mydecisive.ai/",
        }}
      />
      <SimpleCard
        title="Commit your changes to Source control"
        description="Your manifests are ready. Push them to your repository to make the configuration official and version-controlled."
        direction="column"
        button={{
          text: "Download .zip",
          onClick: handleDownloadManifestsClick,
          loading,
        }}
        link={{
          text: "See our docs",
          href: "https://docs.mydecisive.ai/",
        }}
      />
      <SimpleCard
        title="Revert your Argo CD & Datadog agent changes"
        description="Something didn't go as planned. Run the command below to restore both your Argo CD configuration and Datadog agent to their previous state:"
        content={<CodeSnippet code={`argocd app delete ${connectionName}`} />}
      />
    </CenterColumn>
  );
}
