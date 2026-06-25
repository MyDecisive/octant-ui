export type InputValidationErrors = string[] | string | undefined;
type FieldValidator<T = string> = (value?: T) => string | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormFields = Record<string, FieldValidator<any>[]>;

export type FieldValidationMap = Record<
  string,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate: (value?: any) => InputValidationErrors;
    onValidation: (error: InputValidationErrors) => void;
  }
>;

export type FieldErrorsMap = Record<
  keyof FormFields,
  InputValidationErrors | null
>;
