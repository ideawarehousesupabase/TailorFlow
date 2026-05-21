import { Link } from "@tanstack/react-router";
import { Scissors } from "lucide-react";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-neutral-900">
            <Scissors className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">TailorFlow</span>
        </Link>
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-neutral-500">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-700">{label}</span>
      <input
        {...props}
        className="block w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-neutral-900/10 transition focus:border-neutral-400 focus:ring-2"
      />
    </label>
  );
}
