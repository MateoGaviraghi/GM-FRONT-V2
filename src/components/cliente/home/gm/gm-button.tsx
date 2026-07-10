"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type GmIcon = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
}>;

const gmButton = cva(
  [
    "group/btn relative inline-flex items-center justify-center gap-3",
    "overflow-hidden border select-none",
    "transition-colors duration-300",
    "focus-visible:outline-2 focus-visible:outline-offset-3",
  ].join(" "),
  {
    variants: {
      tone: {
        solidLight: "border-platinum bg-platinum text-carbon-0",
        outlineDark: "border-line-dark-2 bg-transparent text-platinum",
        solidDark: "border-ink-0 bg-ink-0 text-paper-1",
        outlineLight: "border-line-light-2 bg-transparent text-ink-0",
      },
      size: {
        sm: "h-10 px-5",
        md: "h-12 px-7",
        lg: "h-14 px-9",
      },
    },
    defaultVariants: { tone: "solidLight", size: "md" },
  }
);

const sweep = cva(
  [
    "pointer-events-none absolute inset-0 -translate-x-[101%]",
    "transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
    "group-hover/btn:translate-x-0",
  ].join(" "),
  {
    variants: {
      tone: {
        solidLight: "bg-carbon-0",
        outlineDark: "bg-platinum",
        solidDark: "bg-petrol-deep",
        outlineLight: "bg-ink-0",
      },
    },
  }
);

const labelTone = cva("", {
  variants: {
    tone: {
      solidLight: "group-hover/btn:text-platinum",
      outlineDark: "group-hover/btn:text-carbon-0",
      solidDark: "group-hover/btn:text-white",
      outlineLight: "group-hover/btn:text-paper-1",
    },
  },
});

type GmButtonProps = VariantProps<typeof gmButton> & {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  icon?: GmIcon | null;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function GmButton({
  children,
  href,
  external,
  tone,
  size,
  icon = ArrowUpRight,
  className,
  onClick,
  ariaLabel,
}: GmButtonProps) {
  const Icon = icon;
  const content = (
    <>
      <span aria-hidden className={sweep({ tone })} />
      <span
        className={cn(
          "gm-label relative z-10 transition-colors duration-300",
          labelTone({ tone })
        )}
      >
        {children}
      </span>
      {Icon ? (
        <Icon
          aria-hidden
          className={cn(
            "relative z-10 size-4 transition-all duration-300",
            "group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5",
            labelTone({ tone })
          )}
          strokeWidth={1.75}
        />
      ) : null}
    </>
  );

  const classes = cn(gmButton({ tone, size }), className);

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
