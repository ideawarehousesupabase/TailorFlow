import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader, StatusBadge } from "@/components/Shell";
import { getOrders, type OrderStatus } from "@/lib/store";
import { useStoreTick } from "@/lib/use-store";
import { Search } from "lucide-react";

export const Route = createFileRoute("/merchant/orders")({
  component: Page,
});

const STATUSES: ("All" | OrderStatus)[] = [
  "All",
  "New",
  "Routed",
  "In Alteration",
  "QA Pending",
  "Approved",
  "Dispatched",
];

function Page() {
  useStoreTick();
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("All");
  const [q, setQ] = useState("");
  const orders = getOrders().filter((o) => {
    if (filter !== "All" && o.status !== filter) return false;
    if (q && !(`${o.id} ${o.customer.name} ${o.product.name}`.toLowerCase().includes(q.toLowerCase())))
      return false;
    return true;
  });

  return (
    <Shell role="merchant">
      <PageHeader title="Orders" subtitle="Manage and route alteration requests" />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orders…"
            className="w-64 rounded-md border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-neutral-400"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors " +
                (filter === s
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50")
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Alteration</th>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">ETA</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-4 py-3">{o.customer.name}</td>
                <td className="px-4 py-3">{o.product.name}</td>
                <td className="max-w-xs truncate px-4 py-3 text-xs text-neutral-600">
                  {o.alteration.standardized || o.alteration.requested.join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-xs">{o.partnerId ? "Stitch Studio" : "—"}</td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {new Date(o.eta).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/merchant/orders/$id"
                    params={{ id: o.id }}
                    className="text-xs font-medium text-neutral-900 underline-offset-2 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-neutral-500">
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
