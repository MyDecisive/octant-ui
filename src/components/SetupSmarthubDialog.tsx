import type { DialogErrorInfo } from "@app-types/components";
import type { ErrorModalCTA } from "@app-types/copy";
import type { ErrorModalActs, ErrorModalSeverity } from "@app-types/enums";
import { Dialog } from "@components/Dialog";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Button from "@mui/material/Button";
import { useMemo, type ReactNode } from "react";
import { ERROR_MODAL_ACT, ERROR_SEVERITY } from "../constants/enums";
import "./SetupSmarthubDialog.css";

interface SetupSmarthubDialogProps {
  open: boolean;
  onClose: () => void;
  errorInfo: DialogErrorInfo | null;
}

type ActMap = Record<ErrorModalActs, () => void>;

function createActions(actMap: ActMap, actions: ErrorModalCTA[]) {
  return actions.map((action) => (
    <Button
      key={action.text}
      onClick={() => {
        action.act.forEach((act) => actMap[act]());
      }}
    >
      {action.text}
    </Button>
  ));
}

const iconBySeverity: Record<ErrorModalSeverity, ReactNode> = {
  [ERROR_SEVERITY.ERROR]: <ErrorOutlineRoundedIcon color="error" />,
  [ERROR_SEVERITY.WARN]: <WarningAmberIcon color="warning" />,
};

export function SetupSmarthubDialog({
  open,
  onClose,
  errorInfo,
}: SetupSmarthubDialogProps) {
  const {
    header,
    severity = ERROR_SEVERITY.ERROR,
    body,
    actions = [],
    networkErrorInfo,
  } = errorInfo ?? {};

  const icon = iconBySeverity[severity];

  // TODO: refine this such that it provides button/link props
  const actMap: ActMap = useMemo(() => {
    return {
      [ERROR_MODAL_ACT.CLOSE]: onClose,
      [ERROR_MODAL_ACT.VISIT_DOCS]: () => {
        window.location.assign("https://docs.mydecisive.ai/");
      },
      [ERROR_MODAL_ACT.REPORT_BUG]: () => {
        window.alert("We need a URL for this");
      },
    };
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
      icon={icon}
      title={header}
      description={body}
      actions={createActions(actMap, actions)}
    >
      {networkErrorInfo && (
        <pre className="error-dialog-error-info-content">
          {networkErrorInfo}
        </pre>
      )}
    </Dialog>
  );
}
