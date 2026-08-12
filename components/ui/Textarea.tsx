"use client";

import { TextareaHTMLAttributes, forwardRef, useId } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  fieldName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, className, id, fieldName, ...rest },
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
      <textarea ref={ref} id={inputId} className={clsx("field-input min-h-[70px] resize-y", className)} {...rest} />
    </div>
  );
});
