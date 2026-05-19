import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import CableRoundedIcon from "@mui/icons-material/CableRounded";
import MiscellaneousServicesRoundedIcon from "@mui/icons-material/MiscellaneousServicesRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useLocation } from "wouter";
import Octobuddy from "../assets/logo.svg?react";
import { ROUTES } from "../constants/routing";
import "./Splash.css";
import { SplashCopy as copy } from "../copy/install/Splash.copy";

const ROWS = [
  {
    Icon: RocketLaunchRoundedIcon,
    text: copy.rocket,
  },
  {
    Icon: MiscellaneousServicesRoundedIcon,
    text: copy.gear,
  },
  {
    Icon: CableRoundedIcon,
    text: copy.wire,
  },
];

export function Splash() {
  const [, setLocation] = useLocation();
  const onClickProgress = () => {
    setLocation(ROUTES.INSTALL);
  };
  return (
    <FlowCenterColumn>
      <ViewTitle
        title={
          <Stack direction="row" gap="10px" alignItems={"center"}>
            <Octobuddy />
            {copy.header}
          </Stack>
        }
        description={copy.subheader}
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
        {copy.cta}
      </Button>
    </FlowCenterColumn>
  );
}
