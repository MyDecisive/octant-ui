import FilterListIcon from "@mui/icons-material/FilterList";
import MonitorHeartRounded from "@mui/icons-material/MonitorHeartRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import SupportRounded from "@mui/icons-material/SupportRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useConnectionValidationStore } from "@store/connectionValidationStore";
import { useOctantStore } from "@store/octantStore";
import classNames from "classnames";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";
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
  connectionStatus,
  hubInstalled,
  loading,
}: {
  connectionStatus: ReturnType<
    typeof useConnectionValidationStore.getState
  >["connectionStatus"];
  hubInstalled?: boolean;
  loading: boolean;
}) {
  if (loading) return "loading";
  if (hubInstalled === false) return "error";

  if (connectionStatus) {
    const connectionIsHealthy =
      connectionStatus.clientsConnected &&
      connectionStatus.receivingData &&
      connectionStatus.sendingData &&
      connectionStatus.dataIntegrity;

    if (!connectionIsHealthy) return "error";
    if (hubInstalled === true) return "healthy";
  }

  return null;
}

export function PageNav() {
  const [location, setLocation] = useLocation();
  const hubInstalled = useOctantStore((state) => state.hubInstalled);
  const { connectionStatus, loading } = useConnectionValidationStore(
    useShallow(({ connectionStatus, status }) => ({
      connectionStatus,
      loading: status === "loading",
    })),
  );
  const systemHealthNavStatus = getSystemHealthNavStatus({
    connectionStatus,
    hubInstalled,
    loading,
  });

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
          {href === ROUTES.SYSTEMHEALTH && systemHealthNavStatus && (
            <Box
              component="span"
              className={classNames(
                "mdai-page-nav-status-dot",
                systemHealthNavStatus,
              )}
              aria-label={
                systemHealthNavStatus === "loading"
                  ? "System health validating"
                  : systemHealthNavStatus === "healthy"
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
