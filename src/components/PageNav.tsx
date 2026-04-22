import ApiIcon from "@mui/icons-material/Api";
import FilterListIcon from "@mui/icons-material/FilterList";
import PowerIcon from "@mui/icons-material/Power";
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import classNames from "classnames";
import { useLocation } from "wouter";
import Octobuddy from "../assets/logo-black.svg?react";
import { ROUTES } from "../constants/ROUTES";
import "./PageNav.css";
const navButtons = [
  {
    label: "Octant",
    href: ROUTES.SPLASH,
    Icon: ApiIcon,
  },
  {
    label: "Clarity",
    href: ROUTES.CLARITY,
    Icon: FilterListIcon,
  },
  {
    label: "Connections",
    href: ROUTES.CONNECTIONS,
    Icon: PowerIcon,
  },
  {
    label: "SmartHub",
    href: ROUTES.SMARTHUB,
    Icon: Octobuddy,
  },
];

export function PageNav() {
  const [location, setLocation] = useLocation();

  return (
    <Stack className="mdai-page-nav-container" gap={2}>
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
