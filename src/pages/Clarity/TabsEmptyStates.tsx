import { NoConnectionCard } from "@components/NoConnectionCard";
import LinkOffRoundedIcon from "@mui/icons-material/LinkOffRounded";
import type { ComponentProps } from "react";
import { useLocation } from "wouter";
import { ROUTES } from "../../constants/routing";
import { ClarityCopy } from "../../copy/clarity/Clarity.copy";

type EmptyStateCardProps = ComponentProps<typeof NoConnectionCard>;

type ClarityDataType = "logs" | "traces";

interface TabsEmptyStateProps {
  type: ClarityDataType;
  configured: boolean;
  hasData: boolean;
  onClearSearch: () => void;
  onRefreshData: () => void;
  percentSampled?: number;
  searchQuery: string;
}

const reportBugLink: EmptyStateCardProps["link"] = {
  label: "Report a bug",
  href: "https://github.com/MyDecisive/octant/issues",
  external: true,
};

function renderNoConnectionCard({
  link = reportBugLink,
  ...props
}: EmptyStateCardProps) {
  return <NoConnectionCard {...props} link={link} />;
}

export function TabsEmptyState({
  configured,
  hasData,
  onClearSearch,
  onRefreshData,
  percentSampled,
  searchQuery,
  type,
}: TabsEmptyStateProps) {
  const [, setLocation] = useLocation();
  const copy =
    type === "logs"
      ? ClarityCopy.logsEmptyStates
      : ClarityCopy.traceEmptyStates;
  const setupCopy =
    type === "logs"
      ? ClarityCopy.logFilter.emptyState
      : ClarityCopy.traceFilter.emptyState;

  // Data type is not configured in settings.
  if (!configured) {
    return renderNoConnectionCard({
      title: setupCopy.title,
      description: setupCopy.subtitle,
      actionLabel: setupCopy.cta,
      onButtonClick: () => setLocation(ROUTES.SETTINGS),
    });
  }

  // Data type is configured, but sampling is 0% and no data is flowing.
  if (!hasData && (percentSampled === undefined || percentSampled === 0)) {
    return renderNoConnectionCard({
      title: copy.zeroSampling.title,
      description: copy.zeroSampling.description,
      alerts: [
        {
          severity: "warning",
          title: "Sampling is set to 0%",
        },
      ],
      actionLabel: "Refresh table",
      onButtonClick: onRefreshData,
    });
  }

  // Data type is configured and sampled, but no data is flowing.
  if (!hasData) {
    const { title, description, actionLabel } = copy.filteringIssue;
    return renderNoConnectionCard({
      title,
      description,
      actionLabel: "Refresh table",
      link: {
        label: actionLabel ?? "Review in System Health",
        onClick: () => setLocation(ROUTES.SYSTEMHEALTH),
      },
      onButtonClick: onRefreshData,
    });
  }

  // Data is available, but the current search has no matches.
  if (searchQuery) {
    const { title, description, actionLabel } = copy.noResults(searchQuery);
    return renderNoConnectionCard({
      title,
      description,
      icon: <LinkOffRoundedIcon fontSize="small" />,
      actionLabel,
      onButtonClick: onClearSearch,
    });
  }

  // Default fallback for an unexpected empty table state.
  return renderNoConnectionCard({
    title: copy.filteringIssue.title,
    description: copy.filteringIssue.description,
    actionLabel: "Refresh table",
    onButtonClick: onRefreshData,
  });
}
