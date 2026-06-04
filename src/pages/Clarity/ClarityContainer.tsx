import { FullscreenLoader } from "@components/FullscreenLoader";
import { PageContainer } from "@components/layout/PageContainer";
import { useOctantStore } from "@store/octantStore";
import { useInitClarity } from "@utils/initialization/useInitClarity";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";
import { ROUTES } from "../../constants/routing";

export function ClarityContainer({ children }: { children: React.ReactNode }) {
  const { connectionScope, hubInstalled } = useOctantStore(
    useShallow(({ connection, hubInstalled }) => ({
      connectionScope: connection?.scope,
      hubInstalled,
    })),
  );
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
