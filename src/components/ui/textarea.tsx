"use client";
import * as React from "react";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={
          "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none min-h-[80px] " +
          (className || "")
        }
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
