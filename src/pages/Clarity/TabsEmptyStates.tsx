import { NoConnectionCard } from "@components/NoConnectionCard";
import LinkOffRoundedIcon from "@mui/icons-material/LinkOffRounded";
import Button from "@mui/material/Button";
import { FilterTypes } from "@types";
import type { ComponentProps, ReactNode } from "react";
import { useLocation } from "wouter";
import { ROUTES } from "../../constants/routing";
import { ClarityCopy } from "../../copy/clarity/Clarity.copy";

type EmptyStateCardProps = ComponentProps<typeof NoConnectionCard>;

interface TabsEmptyStateProps {
  dataType: FilterTypes;
  configured: boolean;
  hasData: boolean;
  onClearSearch: () => void;
  onRefreshData: () => Promise<void>;
  percentSampled?: number;
  searchQuery: string;
}

function ReportBugButton() {
  return (
    <Button
      href="https://github.com/MyDecisive/octant/issues"
      rel="noopener noreferrer"
      size="small"
      target="_blank"
      variant="text"
      color="inherit"
    >
      Report a bug
    </Button>
  );
}

function renderActions({
  primaryLabel,
  onPrimaryClick,
  secondaryAction,
}: {
  primaryLabel?: string;
  onPrimaryClick?: () => void;
  secondaryAction?: ReactNode;
}) {
  return (
    <>
      {primaryLabel && onPrimaryClick && (
        <Button variant="secondary" size="small" onClick={onPrimaryClick}>
          {primaryLabel}
        </Button>
      )}
      {secondaryAction ?? <ReportBugButton />}
    </>
  );
}

function getEmptyStateCardProps({
  configured,
  copy,
  hasData,
  onClearSearch,
  onRefreshData,
  onReviewSystemHealth,
  onSetupDataType,
  percentSampled,
  searchQuery,
  setupCopy,
}: {
  configured: boolean;
  copy: typeof ClarityCopy.logsEmptyStates;
  hasData: boolean;
  onClearSearch: () => void;
  onRefreshData: () => Promise<void>;
  onReviewSystemHealth: () => void;
  onSetupDataType: () => void;
  percentSampled?: number;
  searchQuery: string;
  setupCopy: typeof ClarityCopy.logFilter.emptyState;
}): EmptyStateCardProps {
  // Data type is not configured in settings.
  if (!configured) {
    return {
      title: setupCopy.title,
      description: setupCopy.subtitle,
      actions: renderActions({
        primaryLabel: setupCopy.cta,
        onPrimaryClick: onSetupDataType,
      }),
    };
  }

  // Data type is configured, but sampling is 0% and no data is flowing.
  if (!hasData && (percentSampled === undefined || percentSampled === 0)) {
    return {
      title: copy.zeroSampling.title,
      description: copy.zeroSampling.description,
      alerts: [
        {
          severity: "warning",
          title: "Sampling is set to 0%",
        },
      ],
      actions: renderActions({
        primaryLabel: "Refresh table",
        onPrimaryClick: () => void onRefreshData(),
      }),
    };
  }

  // Data type is configured and sampled, but no data is flowing.
  if (!hasData) {
    const { title, description, actionLabel } = copy.filteringIssue;
    return {
      title,
      description,
      actions: renderActions({
        primaryLabel: "Refresh table",
        onPrimaryClick: () => void onRefreshData(),
        secondaryAction: (
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={onReviewSystemHealth}
          >
            {actionLabel ?? "Review in System Health"}
          </Button>
        ),
      }),
    };
  }

  // Data is available, but the current search has no matches.
  if (searchQuery) {
    const { title, description, actionLabel } = copy.noResults(searchQuery);
    return {
      title,
      description,
      icon: <LinkOffRoundedIcon fontSize="small" />,
      actions: renderActions({
        primaryLabel: actionLabel,
        onPrimaryClick: onClearSearch,
      }),
    };
  }

  // Default fallback for an unexpected empty table state.
  return {
    title: copy.filteringIssue.title,
    description: copy.filteringIssue.description,
    actions: renderActions({
      primaryLabel: "Refresh table",
      onPrimaryClick: () => void onRefreshData(),
    }),
  };
}

export function TabsEmptyState({
  configured,
  hasData,
  onClearSearch,
  onRefreshData,
  percentSampled,
  searchQuery,
  dataType,
}: TabsEmptyStateProps) {
  const [, setLocation] = useLocation();
  const copy =
    dataType === FilterTypes.LOG
      ? ClarityCopy.logsEmptyStates
      : ClarityCopy.traceEmptyStates;
  const setupCopy =
    dataType === FilterTypes.LOG
      ? ClarityCopy.logFilter.emptyState
      : ClarityCopy.traceFilter.emptyState;

  return (
    <NoConnectionCard
      {...getEmptyStateCardProps({
        configured,
        copy,
        hasData,
        onClearSearch,
        onRefreshData,
        onReviewSystemHealth: () => setLocation(ROUTES.SYSTEMHEALTH),
        onSetupDataType: () => setLocation(ROUTES.SETTINGS),
        percentSampled,
        searchQuery,
        setupCopy,
      })}
    />
  );
}
