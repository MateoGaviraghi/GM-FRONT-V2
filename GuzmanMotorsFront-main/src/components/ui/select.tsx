"use client";
import * as React from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function Select({ children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={
        "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none " +
        (props.className || "")
      }
    >
      {children}
    </select>
  );
}

export function SelectTrigger({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={"relative " + (props.className || "")}>
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span className="text-slate-400 select-none">{placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({
  value,
  children,
  ...props
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}
