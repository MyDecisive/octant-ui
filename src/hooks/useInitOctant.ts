import { useInitConnectionValidation } from "./useInitConnectionValidation";
import { useResolveConnection } from "./useResolveConnection";
import { useVerifyHubInstall } from "./useVerifyHubInstall";

export function useInitOctant() {
  const resolving = useResolveConnection();
  const verifying = useVerifyHubInstall(resolving);
  useInitConnectionValidation(resolving);

  return resolving || verifying;
}
