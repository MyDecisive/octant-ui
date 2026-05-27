import { useResolveConnectionScope } from "./useResolveConnectionScope";
import { useVerifyHubInstall } from "./useVerifyHubInstall";

export function useInitOctant() {
  const resolving = useResolveConnectionScope();
  const verifying = useVerifyHubInstall(resolving);

  return resolving || verifying;
}
