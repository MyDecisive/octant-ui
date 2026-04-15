import { CenterColumn } from "@components/layout/CenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import CableRoundedIcon from "@mui/icons-material/CableRounded";
import MiscellaneousServicesRoundedIcon from "@mui/icons-material/MiscellaneousServicesRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { BaseFlowViewProps } from "@types";
import "./Splash.css";

const ROWS = [
  {
    Icon: RocketLaunchRoundedIcon,
    text: "Install ArgoCD and connect to your dev environment",
  },
  {
    Icon: MiscellaneousServicesRoundedIcon,
    text: "Set up your Smarthub",
  },
  {
    Icon: CableRoundedIcon,
    text: "Connect to your data source and destination",
  },
];

export function Splash({
  onClickProgress,
}: Pick<BaseFlowViewProps, "onClickProgress">) {
  return (
    <CenterColumn>
      <ViewTitle
        title={
          <Stack direction="row" gap="10px" alignItems={"center"}>
            <img src="./logo.svg" alt="Octobuddy" className="octobuddy-logo" />
            Get started with Octant
          </Stack>
        }
        description="[Easy OTel in Minutes!]"
      />
      <Stack direction="column" gap={2}>
        {ROWS.map(({ Icon, text }, index) => (
          <Stack
            gap="10px"
            key={`splash-line-${index}`}
            direction={"row"}
            alignItems={"center"}
          >
            <Avatar className="splash-avatar">
              <Icon />
            </Avatar>
            <Typography>{text}</Typography>
          </Stack>
        ))}
      </Stack>
      <Button
        className="splash-button"
        variant="contained"
        size="small"
        type={"button"}
        onClick={onClickProgress}
      >
        Let's get going
      </Button>
    </CenterColumn>
  );
}
