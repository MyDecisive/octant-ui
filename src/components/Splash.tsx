import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import { isDemo } from "@constants/env";
import CableRoundedIcon from "@mui/icons-material/CableRounded";
import MiscellaneousServicesRoundedIcon from "@mui/icons-material/MiscellaneousServicesRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { useLocation } from "wouter";
import Octobuddy from "../assets/logo.svg?react";
import { ROUTES } from "../constants/routing";
import { DemoSplashCopy, SplashCopy } from "../copy/install/Splash.copy";
import "./Splash.css";

const copy = isDemo ? DemoSplashCopy : SplashCopy;
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
  const setInstallAndConnectField = useInstallAndConnectStore(
    (state) => state.setFormField,
  );
  const onClickProgress = () => {
    if (isDemo) {
      setInstallAndConnectField("lastCompletedStep", 0);
    }
    setLocation(`${ROUTES.INSTALL}/1`);
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
        description={
          isDemo ? (
            <Stack className="splash-demo-description" gap={2}>
              {Array.isArray(copy.subheader) &&
                copy.subheader.map((paragraph, index) => (
                  <Typography
                    key={`splash-demo-description-${index}`}
                    variant="body1"
                  >
                    {paragraph}
                  </Typography>
                ))}
            </Stack>
          ) : (
            copy.subheader
          )
        }
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
