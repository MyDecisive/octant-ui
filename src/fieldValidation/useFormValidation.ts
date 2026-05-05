import type {
  FieldErrorsMap,
  FieldValidationMap,
  FormFields,
  InputValidationErrors,
} from "@types";
import { useMemo, useState } from "react";

export function useFormValidation(fields: FormFields) {
  const fieldNames = useMemo(() => {
    return Object.keys(fields);
  }, [fields]);

  const [fieldErrors, setFieldErrors] = useState<FieldErrorsMap>(() =>
    Object.fromEntries(Object.keys(fields).map((key) => [key, null])),
  );

  const validationCallbacks = useMemo(() => {
    return Object.entries(fields).reduce((accum, [key, spec]) => {
      accum[key] = {
        onValidation: (error) =>
          setFieldErrors((errors) => ({ ...errors, [key]: error })),
        validate: (value?: string) => {
          const errors: string[] = [];

          for (let i = 0; i < spec.length; i++) {
            const error = spec[i](value);
            if (error) errors.push(error);
          }

          if (!errors.length) {
            return undefined;
          }

          if (errors.length === 1) {
            return errors[0];
          }

          return errors;
        },
      };

      return accum;
    }, {} as FieldValidationMap);
  }, [fields]);

  const formIsValid = fieldNames.every(
    (name) => fieldErrors[name] === undefined,
  );

  const validateAll = (values: Record<string, unknown>) => {
    const results: Record<string, InputValidationErrors> = {};

    for (const [key, validators] of Object.entries(fields)) {
      const errors = validators.reduce<string[]>((acc, fn) => {
        const error = fn(values[key]);
        if (error) acc.push(error);
        return acc;
      }, []);

      results[key] =
        errors.length === 0
          ? undefined
          : errors.length === 1
            ? errors[0]
            : errors;
    }

    setFieldErrors(results);
    return Object.values(results).every((e) => e === undefined);
  };

  return {
    callbacks: validationCallbacks,
    formIsValid,
    fieldErrors,
    validateAll,
  };
}
