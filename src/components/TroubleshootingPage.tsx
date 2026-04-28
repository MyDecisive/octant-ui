import Stack from "@mui/material/Stack";
import { CompactCard, type CompactCardProps } from "./CompactCard";
import { StatusCard, type StatusCardProps } from "./StatusCard";
import "./TroubleshootingPage.css";
interface TroubleshootingPageProps {
  status: StatusCardProps;
  fixes: CompactCardProps;
}

export function TroubleshootingPage({
  status,
  fixes,
}: TroubleshootingPageProps) {
  return (
    <Stack
      className="troubleshoot-container"
      direction="row"
      justifyContent={"center"}
      alignItems={"flex-start"}
    >
      <Stack
        className="troubleshoot-column"
        justifyContent={"flex-start"}
        alignItems={"stretch"}
        gap={2}
      >
        <StatusCard {...status} />
        <CompactCard {...fixes} />
      </Stack>
    </Stack>
  );
}
