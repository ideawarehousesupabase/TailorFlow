import { createFileRoute, Link } from "@tanstack/react-router";
import { Scissors, ArrowRight, Shield, Store, Scissors as ScissorsIcon } from "lucide-react";

export const Route = createFileRoute("/")(  {
  component: Landing,
});

function RoleCard({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md"
    >
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-neutral-100 text-neutral-900 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>
      <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-neutral-900">
        Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-neutral-900">
      <header className="border-b border-neutral-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-neutral-900">
              <Scissors className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">TailorFlow</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          B2B fashion operations · MVP prototype
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
          Alter before you dispatch.
          <br />
          Cut fit-related returns.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-600 md:text-base">
          TailorFlow captures alteration requests at checkout, routes them to vetted
          tailoring partners, and verifies quality before the parcel ships.
        </p>
      </section>

      <section id="roles" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-neutral-500">
          Choose your workspace
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <RoleCard
            to="/login"
            icon={Store}
            title="Merchant"
            description="Fashion brand operations — orders, routing, product rules, analytics."
          />
          <RoleCard
            to="/login"
            icon={ScissorsIcon}
            title="Tailoring Partner"
            description="Accept jobs, upload before/after photos, submit for QA."
          />
          <RoleCard
            to="/login"
            icon={Shield}
            title="QA Inspector"
            description="Verify alteration quality before garments ship."
          />
        </div>
      </section>
    </div>
  );
}
