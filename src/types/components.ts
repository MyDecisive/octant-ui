import type { ChipProps } from "@mui/material/Chip";
import type { TextFieldProps } from "@mui/material/TextField";
import type { TooltipProps } from "@mui/material/Tooltip";
import { type AlertProps as MuiAlertProps } from "@mui/material/Alert";
import type { DataGridProps, GridColDef } from "@mui/x-data-grid";
import type { ReactElement, ReactNode } from "react";
import type { ErrorModalContent } from "./copy";
import type { InputValidationErrors } from "./validation";
import type { ValueOf } from "./utility";
import { HEALTH_WIDGET_STATUS } from "@constants/enums";
import type { UIFilterType } from "./enums";

// ============================================================================
// Display components
// ============================================================================

/**
 * Table & children
 */
declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    label: string;
    summaryTable?: boolean;
    tooltip?: TableToolbarTooltip;
    total: string;
    timeRangeLabel?: string;
  }
  interface FooterPropsOverrides {
    total?: string;
    label: string;
    hideFooterPagination?: boolean;
  }
}

export interface BaseRowDefinition {
  id: string;
}

export interface SpanData extends BaseRowDefinition {
  span: string;
  breadth: number;
  invocations: number;
  depth: number;
  cost: number;
}

export interface LogData extends BaseRowDefinition {
  name: string;
  sent: number;
  percent: number;
  cost: number;
}

export interface SummaryData extends BaseRowDefinition {
  type: UIFilterType;
  cost: number | undefined;
  sent: number | undefined;
  rate: number | undefined;
  pct: number | undefined;
}

export interface TableProps<T extends BaseRowDefinition> extends Omit<
  DataGridProps,
  "rows" | "columns" | "label"
> {
  rows: T[];
  columns: GridColDef<T>[];
  label?: string;
  header?: ReactNode;
  footerLabel?: string;
  footerClassName?: string;
  timeRangeLabel?: string;
  toolbarTooltip?: TableToolbarTooltip;
  total?: string;
  summaryTable?: boolean;
}

// TODO: Once copy types, content, etc. is revised, this can be revised to leverage RichTooltipProps interface
export interface TableToolbarTooltip {
  targetIcon?: ReactElement;
  header?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  placement?: TooltipProps["placement"];
}

/**
 * RichTooltip
 */
export interface RichTooltipProps extends Omit<TooltipProps, "title"> {
  title?: string;
  description?: string;
  actions?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  actionRowClassName?: string;
}

/**
 * SetupSmarthubDialog
 */
// TODO: [copy] Can this type, or its use, be simplified somehow?
export interface DialogErrorInfo extends Omit<
  ErrorModalContent,
  "showNetworkError"
> {
  networkErrorInfo?: string;
}

/**
 * Health Widget & children
 */
export interface FixCardProps {
  label?: string;
  description?: ReactNode;
  actions?: {
    onClick?: () => void;
    text: string;
    href?: string;
  }[];
}

export interface HealthFacetRowProps {
  label: string;
  health?: boolean;
  loading?: boolean;
  fix?: FixCardProps;
}

export type HealthWidgetStatus = ValueOf<typeof HEALTH_WIDGET_STATUS>;

export interface HealthWidgetProps {
  title: string;
  timestamp?: string;
  status?: HealthWidgetStatus;
  fix?: FixCardProps;
  facets?: HealthFacetRowProps[];
  simple?: boolean;
  containerClassName?: string;
}

/**
 * Tabs & children
 */
export interface TabLabelProps {
  text: string;
  tooltip?: string | RichTooltipProps;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export interface TabItem {
  value: string;
  label: string | TabLabelProps;
  children: ReactNode;
}

/**
 * Alert
 */
export interface AlertProps extends MuiAlertProps {
  title?: string;
  description?: string;
}

// ============================================================================
// Form components
// ============================================================================
export interface SearchFieldProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export interface InputProps extends Omit<
  TextFieldProps<"outlined">,
  "variant"
> {
  tooltip?: string;
  success?: boolean;
  validate?: (value?: string) => InputValidationErrors;
  onValidation?: (error: InputValidationErrors) => void;
  value?: string;
  helperText?: string;
}

export interface SelectOption {
  label?: string;
  helperText?: string;
  chip?: ChipProps;
  disabled?: boolean;
  value: string;
}
