import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader, StatusBadge } from "@/components/Shell";
import { getOrders, updateOrder } from "@/lib/store";
import { useStoreTick } from "@/lib/use-store";

export const Route = createFileRoute("/partner/queue")({
  component: Page,
});

function Page() {
  useStoreTick();
  const jobs = getOrders().filter(
    (o) =>
      (o.partnerId === "u_part" || o.status === "Routed" || o.status === "New") &&
      !["Approved", "Dispatched", "Rejected"].includes(o.status),
  );

  const accept = (id: string) =>
    updateOrder(id, (o) => ({
      ...o,
      partnerId: "u_part",
      status: "In Alteration",
      timeline: [
        ...o.timeline,
        { label: "Tailor Accepted", at: new Date().toISOString() },
        { label: "Alteration Started", at: new Date().toISOString() },
      ],
    }));

  const reject = (id: string) =>
    updateOrder(id, (o) => ({
      ...o,
      status: "New",
      partnerId: undefined,
    }));

  return (
    <Shell role="partner">
      <PageHeader title="Job queue" subtitle="Accept or reject incoming alteration jobs" />
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Instructions</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-mono text-xs">{j.id}</td>
                <td className="px-4 py-3 text-xs">Atelier North</td>
                <td className="px-4 py-3">{j.product.name}</td>
                <td className="max-w-xs truncate px-4 py-3 text-xs text-neutral-600">
                  {j.alteration.standardized || "—"}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {new Date(j.eta).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={j.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {(j.status === "New" || j.status === "Routed") && (
                      <>
                        <button
                          onClick={() => accept(j.id)}
                          className="rounded-md bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-neutral-800"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => reject(j.id)}
                          className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium hover:bg-neutral-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <Link
                      to="/partner/jobs/$id"
                      params={{ id: j.id }}
                      className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium hover:bg-neutral-50"
                    >
                      Open
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-neutral-500">
                  No jobs in queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
