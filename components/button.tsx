import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-ink text-white hover:bg-slate-700",
  secondary: "bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50",
  ghost: "bg-transparent text-ink hover:bg-slate-100"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary"
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition",
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
