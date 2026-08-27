import { FullscreenLoader } from "@components/FullscreenLoader";
import { PageContainer } from "@components/layout/PageContainer";
import { useHubInstallStore } from "@store/hubInstallStore";
import { useOctantStore } from "@store/octantStore";
import { useInitClarity } from "@hooks/useInitClarity";
import { useLocation } from "wouter";
import { ROUTES } from "../../constants/routing";

export function ClarityContainer({ children }: { children: React.ReactNode }) {
  const connectionScope = useOctantStore((state) => state.connection?.scope);
  const hubInstalled = useHubInstallStore((state) => state.installed);
  const initializing = useInitClarity({ connectionScope });
  const [, navigate] = useLocation();

  if (!connectionScope || !hubInstalled) {
    navigate(ROUTES.INSTALL);
    return null;
  }

  if (initializing) {
    return (
      <PageContainer>
        <FullscreenLoader />
      </PageContainer>
    );
  }

  return <>{children}</>;
}
