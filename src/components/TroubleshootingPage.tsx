import Stack from "@mui/material/Stack";
import { CompactCard, type CompactCardProps } from "./CompactCard";
import { StatusCard, type StatusCardProps } from "./StatusCard";

interface TroubleshootingPageProps {
  status: StatusCardProps;
  fixes: CompactCardProps;
}

export function TroubleshootingPage({
  status,
  fixes,
}: TroubleshootingPageProps) {
  return (
    <Stack direction="row" justifyContent={"center"} alignItems={"flex-start"}>
      <Stack justifyContent={"flex-start"} alignItems={"stretch"}>
        <StatusCard {...status} />
        <CompactCard {...fixes} />
      </Stack>
    </Stack>
  );
}
