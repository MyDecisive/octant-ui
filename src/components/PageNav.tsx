import FilterListIcon from "@mui/icons-material/FilterList";
import MonitorHeartRounded from "@mui/icons-material/MonitorHeartRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import SupportRounded from "@mui/icons-material/SupportRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useOctantStore } from "@store/octantStore";
import classNames from "classnames";
import { useLocation } from "wouter";
import Octobuddy from "../assets/logo.svg?react";
import { ROUTES } from "../constants/routing";
import "./PageNav.css";
const navButtons = [
  {
    label: "Clarity",
    href: ROUTES.CLARITY,
    Icon: FilterListIcon,
  },
  {
    label: "System Health",
    href: ROUTES.SYSTEMHEALTH,
    Icon: MonitorHeartRounded,
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    Icon: SettingsRounded,
  },
  {
    label: "Support",
    href: ROUTES.SUPPORT,
    Icon: SupportRounded,
  },
];

function getSystemHealthNavStatus({
  hubInstalled,
  validation,
}: Pick<
  ReturnType<typeof useOctantStore.getState>,
  "hubInstalled" | "validation"
>) {
  if (hubInstalled === false) return "error";

  if (validation) {
    const connectionIsHealthy =
      validation.clientsConnected &&
      validation.receivingData &&
      validation.sendingData &&
      validation.dataIntegrity;

    if (!connectionIsHealthy) return "error";
    if (hubInstalled === true) return "healthy";
  }

  return null;
}

export function PageNav() {
  const [location, setLocation] = useLocation();
  const systemHealthStatus = useOctantStore(getSystemHealthNavStatus);

  return (
    <Stack className="mdai-page-nav-container" gap={2}>
      <Button
        className="mdai-page-nav-header"
        variant="nav"
        key="Octant"
        onClick={() => setLocation(ROUTES.SPLASH)}
        startIcon={<Octobuddy />}
      >
        Octant
      </Button>
      {navButtons.map(({ label, href, Icon }) => (
        <Button
          className={classNames({
            active: href === location,
            splash: href === ROUTES.SPLASH,
          })}
          variant="nav"
          key={label}
          onClick={() => setLocation(href)}
          startIcon={<Icon />}
        >
          {label}
          {href === ROUTES.SYSTEMHEALTH && systemHealthStatus && (
            <Box
              component="span"
              className={classNames(
                "mdai-page-nav-status-dot",
                systemHealthStatus,
              )}
              aria-label={
                systemHealthStatus === "healthy"
                  ? "System health operational"
                  : "System health error"
              }
            />
          )}
        </Button>
      ))}
    </Stack>
  );
}
