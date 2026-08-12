"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  fieldName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, required, error, hint, fieldName, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? fieldName ?? autoId;
  return (
    <div className="field" data-field={fieldName}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
          {required && <span className="text-[#C0392B] ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx("field-input", error && "field-input-error", className)}
        aria-invalid={!!error}
        {...rest}
      />
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});
