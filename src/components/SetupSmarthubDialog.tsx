import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import type {
  ErrorModalActs,
  ErrorModalContent,
  ErrorModalCTA,
  ErrorModalSeverity,
} from "@types";
import { useMemo, type ReactNode } from "react";
import { ERROR_MODAL_ACT, ERROR_SEVERITY } from "../constants/error";
import "./SetupSmarthubDialog.css";

export interface DialogErrorInfo extends Omit<
  ErrorModalContent,
  "showNetworkError"
> {
  networkErrorInfo?: string;
}

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
    >
      <DialogTitle id="error-dialog-title">
        {icon}
        {header}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="error-dialog-description">
          {body}
          {networkErrorInfo && (
            <pre className="error-dialog-error-info-content">
              {networkErrorInfo}
            </pre>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>{createActions(actMap, actions)}</DialogActions>
    </Dialog>
  );
}
