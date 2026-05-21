import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import {
  LayoutDashboard,
  Package,
  Settings2,
  BarChart3,
  ListChecks,
  ClipboardCheck,
  History,
  LogOut,
  Scissors,
  Gauge,
} from "lucide-react";
import { seed, type Role } from "@/lib/store";
import { useStoreTick } from "@/lib/use-store";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: Record<Role, NavItem[]> = {
  merchant: [
    { to: "/merchant/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/merchant/orders", label: "Orders", icon: Package },
    { to: "/merchant/rules", label: "Product Rules", icon: Settings2 },
    { to: "/merchant/analytics", label: "Analytics", icon: BarChart3 },
  ],
  partner: [
    { to: "/partner/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/partner/queue", label: "Job Queue", icon: ListChecks },
    { to: "/partner/capacity", label: "Capacity", icon: Gauge },
  ],
  qa: [
    { to: "/qa/queue", label: "QA Queue", icon: ClipboardCheck },
    { to: "/qa/history", label: "History", icon: History },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  merchant: "Merchant",
  partner: "Tailoring Partner",
  qa: "QA Inspector",
};

export function Shell({ role, children }: { role: Role; children: ReactNode }) {
  useStoreTick();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading) {
      seed(profile?.uid);
      if (!profile || profile.role !== role) {
        navigate({ to: "/login" });
      }
    }
  }, [role, navigate, profile, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf9]">
        <div className="text-sm text-neutral-500">Loading…</div>
      </div>
    );
  }

  if (!profile || profile.role !== role) return null;

  const nav = NAV[role];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-neutral-900">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-neutral-200 bg-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-neutral-900">
            <Scissors className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">TailorFlow</div>
            <div className="text-[11px] uppercase tracking-wider text-neutral-500">
              {ROLE_LABEL[role]}
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {nav.map((n) => {
            const active = pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors " +
                  (active
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-100")
                }
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-neutral-200 p-3">
          <div className="rounded-md bg-neutral-50 p-3">
            <div className="text-xs font-medium text-neutral-900">{profile.name}</div>
            <div className="truncate text-[11px] text-neutral-500">{profile.email}</div>
          </div>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-100"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="md:pl-60">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-neutral-500">{hint}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    New: "bg-blue-50 text-blue-700 border-blue-200",
    Routed: "bg-violet-50 text-violet-700 border-violet-200",
    "In Alteration": "bg-amber-50 text-amber-800 border-amber-200",
    "QA Pending": "bg-orange-50 text-orange-800 border-orange-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
    Dispatched: "bg-neutral-100 text-neutral-700 border-neutral-200",
  };
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium " +
        (map[status] ?? "bg-neutral-100 text-neutral-700 border-neutral-200")
      }
    >
      {status}
    </span>
  );
}
