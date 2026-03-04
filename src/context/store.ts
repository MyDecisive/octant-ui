import type {
  Action,
  ConnectionPayloadProps,
  StepDefinition,
  Store,
} from "../types";

export const ACTION_TYPES = {
  SET_ACTIVE_STEP: "SET_ACTIVE_STEP",
  SET_FORM_FIELD: "SET_FORM_FIELD",
  RESET_FORM_DATA: "RESET_FORM_DATA",
};

interface SetActiveStepAction extends Action {
  type: (typeof ACTION_TYPES)["SET_ACTIVE_STEP"];
  payload: StepDefinition["id"];
}

interface SetFormFieldAction extends Action {
  type: (typeof ACTION_TYPES)["SET_FORM_FIELD"];
  payload: {
    fieldName: keyof ConnectionPayloadProps;
    value: ConnectionPayloadProps[keyof ConnectionPayloadProps];
  };
}

export type AnyAction = SetActiveStepAction | SetFormFieldAction | Action;

export function appReducer(state: Store, action: Action) {
  switch (action.type) {
    case ACTION_TYPES.SET_ACTIVE_STEP:
      return {
        ...state,
        nav: {
          ...state.nav,
          activeStep: (action as SetActiveStepAction).payload,
        },
      };
    case ACTION_TYPES.SET_FORM_FIELD:
      return {
        ...state,
        form: {
          ...state.form,
          [(action as SetFormFieldAction).payload.fieldName]: (
            action as SetFormFieldAction
          ).payload.value,
        },
      };
    case ACTION_TYPES.RESET_FORM_DATA:
      return {
        ...state,
        form: {},
      };
    default:
      return state;
  }
}
