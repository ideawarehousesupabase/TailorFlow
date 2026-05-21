import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader, Stat } from "@/components/Shell";
import { getOrders } from "@/lib/store";
import { useStoreTick } from "@/lib/use-store";

export const Route = createFileRoute("/partner/dashboard")({
  component: Page,
});

function Page() {
  useStoreTick();
  const jobs = getOrders().filter((o) => o.partnerId === "u_part" || o.status === "Routed" || o.status === "New");
  const assigned = jobs.filter((j) => j.partnerId === "u_part" && j.status === "Routed").length;
  const active = jobs.filter((j) => j.status === "In Alteration").length;
  const completed = jobs.filter((j) => ["QA Pending", "Approved", "Dispatched"].includes(j.status)).length;

  return (
    <Shell role="partner">
      <PageHeader title="Partner dashboard" subtitle="Stitch Studio · TailorFlow workspace" />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Assigned jobs" value={assigned} />
        <Stat label="Active jobs" value={active} />
        <Stat label="Completed" value={completed} />
        <Stat label="SLA performance" value="96%" hint="last 30d" />
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-3 text-sm font-semibold">Today's queue</div>
        <div className="space-y-2">
          {jobs.slice(0, 6).map((j) => (
            <div
              key={j.id}
              className="flex items-center justify-between rounded-md border border-neutral-100 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-500">{j.id}</span>
                <span className="font-medium">{j.product.name}</span>
              </div>
              <span className="text-xs text-neutral-500">{j.status}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
