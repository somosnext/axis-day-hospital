import Link from "next/link";

import { cn } from "@/lib/utils";

export function Button({
  href,
  className,
  children,
  variant = "primary",
  type,
  onClick,
  disabled,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "light" | "outline";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const styles = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 border px-6 text-xs font-bold uppercase tracking-[.12em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "border-navy bg-navy !text-white hover:bg-navy-950",
    variant === "light" && "border-white bg-white !text-[#003659] hover:bg-off-white",
    variant === "outline" && "border-current bg-transparent hover:bg-white/10",
    className,
  );

  return href ? (
    <Link href={href} className={styles}>
      {children}
    </Link>
  ) : (
    <button type={type || "button"} onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}
