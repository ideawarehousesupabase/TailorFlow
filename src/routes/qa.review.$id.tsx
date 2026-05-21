import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader } from "@/components/Shell";
import { getOrders, updateOrder } from "@/lib/store";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/qa/review/$id")({
  component: Page,
});

const CHECKS = [
  "Requested alteration completed",
  "Stitching quality",
  "Finish quality",
  "Measurement accuracy",
];

function Page() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const order = getOrders().find((o) => o.id === id);
  const [checks, setChecks] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECKS.map((c) => [c, true])),
  );
  const [notes, setNotes] = useState("");

  if (!order) {
    return (
      <Shell role="qa">
        <PageHeader title="Job not found" />
      </Shell>
    );
  }

  const finalize = (verdict: "Approved" | "Rejected" | "Rework") => {
    if (verdict === "Approved") {
      updateOrder(order.id, (o) => ({
        ...o,
        status: "Approved",
        qaId: "u_qa",
        qaChecklist: checks,
        qaNotes: notes,
        timeline: [...o.timeline, { label: "Completed", at: new Date().toISOString() }],
      }));
    } else if (verdict === "Rejected") {
      updateOrder(order.id, (o) => ({
        ...o,
        status: "Rejected",
        qaId: "u_qa",
        qaChecklist: checks,
        qaNotes: notes,
      }));
    } else {
      updateOrder(order.id, (o) => ({
        ...o,
        status: "In Alteration",
        qaChecklist: checks,
        qaNotes: notes,
      }));
    }
    navigate({ to: "/qa/queue" });
  };

  return (
    <Shell role="qa">
      <button
        onClick={() => navigate({ to: "/qa/queue" })}
        className="mb-4 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to queue
      </button>
      <PageHeader title={`Review ${order.id}`} subtitle={order.product.name} />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ImageCard label="Before" src={order.beforePhoto} />
            <ImageCard label="After" src={order.afterPhoto} />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Standardized instruction
            </div>
            <div className="rounded-md bg-neutral-900 px-4 py-3 text-sm font-medium text-white">
              {order.alteration.standardized || "—"}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="mb-3 text-sm font-semibold">Checklist</div>
            <div className="space-y-2">
              {CHECKS.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checks[c]}
                    onChange={(e) => setChecks((s) => ({ ...s, [c]: e.target.checked }))}
                    className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
                  />
                  {c}
                </label>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="QA notes…"
              className="mt-4 w-full resize-none rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => finalize("Approved")}
              className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Approve
            </button>
            <button
              onClick={() => finalize("Rework")}
              className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Request rework
            </button>
            <button
              onClick={() => finalize("Rejected")}
              className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Reject
            </button>
          </div>
        </aside>
      </div>
    </Shell>
  );
}

function ImageCard({ label, src }: { label: string; src?: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3">
      <div className="mb-2 text-xs font-medium text-neutral-500">{label}</div>
      {src ? (
        <img src={src} className="aspect-[4/3] w-full rounded object-cover" alt={label} />
      ) : (
        <div className="grid aspect-[4/3] w-full place-items-center rounded bg-neutral-50 text-xs text-neutral-400">
          No image
        </div>
      )}
    </div>
  );
}
