import FilterListIcon from "@mui/icons-material/FilterList";
import MonitorHeartRounded from "@mui/icons-material/MonitorHeartRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import SupportRounded from "@mui/icons-material/SupportRounded";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { useLocation } from "wouter";
import Octobuddy from "../assets/logo-black.svg?react";
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

export function PageNav() {
  const [location, setLocation] = useLocation();

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
        </Button>
      ))}
    </Stack>
  );
}
