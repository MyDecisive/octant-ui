import { CodeSnippet } from "@components/CodeSnippet";
import { SimpleCard } from "@components/SimpleCard";
import { ViewContent } from "@components/ViewContent";

export function NextSteps() {
  return (
    <ViewContent
      title="Next steps"
      description={
        <>
          You’re all set. When you’re ready, feel free to check out our labs
          catalog or manage your Argo changes.
        </>
      }
      mainContent={
        <>
          <SimpleCard
            title="Try out one of our solutions"
            description="Play around with our installable labs."
            linkText="See our docs"
            linkHref="https://docs.mydecisive.ai/"
          />
          <SimpleCard
            title="Migrate Smarthub into production"
            description="Ready to go live? Follow our step-by-step guide to safely migrate Smarthub from your current environment into production."
            linkText="See our docs"
            linkHref="https://docs.mydecisive.ai/"
          />
          <SimpleCard
            title="Commit your changes to Source control"
            description="Your manifests are ready. Push them to your repository to make the configuration official and version-controlled."
            linkText="Download .zip"
            linkHref="/"
          />
          <SimpleCard
            title="Revert your Argo CD & Datadog agent changes"
            description="Something didn't go as planned. Run the command below to restore both your Argo CD configuration and Datadog agent to their previous state:"
            // TODO: Replace with actual command once ready
            content={<CodeSnippet code={"[command goes here]"} />}
          />
        </>
      }
    />
  );
}
