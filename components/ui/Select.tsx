"use client";

import { SelectHTMLAttributes, forwardRef, useId } from "react";
import clsx from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  fieldName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, className, id, fieldName, children, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? fieldName ?? autoId;
  return (
    <div className="field" data-field={fieldName}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <select ref={ref} id={inputId} className={clsx("field-input field-select", className)} {...rest}>
        {children}
      </select>
    </div>
  );
});
