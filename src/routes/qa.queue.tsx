import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/Shell";
import { getOrders } from "@/lib/store";
import { useStoreTick } from "@/lib/use-store";

export const Route = createFileRoute("/qa/queue")({
  component: Page,
});

function Page() {
  useStoreTick();
  const jobs = getOrders().filter((o) => o.status === "QA Pending");

  return (
    <Shell role="qa">
      <PageHeader title="QA queue" subtitle="Pending alterations awaiting verification" />
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-mono text-xs">{j.id}</td>
                <td className="px-4 py-3 text-xs">Atelier North</td>
                <td className="px-4 py-3 text-xs">Stitch Studio</td>
                <td className="px-4 py-3">{j.product.name}</td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {new Date(j.eta).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/qa/review/$id"
                    params={{ id: j.id }}
                    className="rounded-md bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-neutral-500">
                  No jobs awaiting QA.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
