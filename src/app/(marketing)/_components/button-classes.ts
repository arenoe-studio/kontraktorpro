function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function buttonClasses(
  variant: "primary" | "secondary" | "outline" | "ghost",
  size: "md" | "lg" | "xl" = "md",
) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-xl font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800";
  const variants = {
    primary: "bg-orange-500 px-5 text-white shadow-sm hover:bg-orange-600",
    secondary: "bg-slate-800 px-5 text-white hover:bg-slate-700",
    outline: "border border-slate-800 px-5 text-slate-800 hover:bg-slate-50",
    ghost: "px-1 text-slate-800 hover:text-orange-600",
  };
  const sizes = {
    md: "text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-7 py-4 text-lg",
  };

  return cn(base, variants[variant], sizes[size]);
}
