import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader, StatusBadge } from "@/components/Shell";
import { getOrders } from "@/lib/store";
import { useStoreTick } from "@/lib/use-store";

export const Route = createFileRoute("/qa/history")({
  component: Page,
});

function Page() {
  useStoreTick();
  const jobs = getOrders().filter((o) =>
    ["Approved", "Rejected", "Dispatched"].includes(o.status),
  );
  return (
    <Shell role="qa">
      <PageHeader title="QA history" subtitle="Approved and rejected jobs" />
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Instruction</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-mono text-xs">{j.id}</td>
                <td className="px-4 py-3">{j.product.name}</td>
                <td className="px-4 py-3 text-xs">{j.customer.name}</td>
                <td className="max-w-xs truncate px-4 py-3 text-xs text-neutral-600">
                  {j.alteration.standardized}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={j.status} />
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-neutral-500">
                  No history yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
