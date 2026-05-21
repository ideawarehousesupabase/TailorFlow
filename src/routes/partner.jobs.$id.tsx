import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell, PageHeader, StatusBadge } from "@/components/Shell";
import { getOrders, updateOrder } from "@/lib/store";
import { useStoreTick } from "@/lib/use-store";
import { ArrowLeft, Upload } from "lucide-react";
import { useRef } from "react";

export const Route = createFileRoute("/partner/jobs/$id")({
  component: Page,
});

function Page() {
  useStoreTick();
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const order = getOrders().find((o) => o.id === id);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  if (!order) {
    return (
      <Shell role="partner">
        <PageHeader title="Job not found" />
      </Shell>
    );
  }

  const upload = (e: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateOrder(order.id, (o) => ({
        ...o,
        [type === "before" ? "beforePhoto" : "afterPhoto"]: reader.result as string,
      }));
    };
    reader.readAsDataURL(f);
  };

  const startWork = () =>
    updateOrder(order.id, (o) => ({
      ...o,
      status: "In Alteration",
      timeline: o.timeline.some((t) => t.label === "Alteration Started")
        ? o.timeline
        : [...o.timeline, { label: "Alteration Started", at: new Date().toISOString() }],
    }));

  const markComplete = () =>
    updateOrder(order.id, (o) => ({
      ...o,
      status: "In Alteration",
    }));

  const submitQA = () =>
    updateOrder(order.id, (o) => ({
      ...o,
      status: "QA Pending",
      timeline: [...o.timeline, { label: "QA Review", at: new Date().toISOString() }],
    }));

  return (
    <Shell role="partner">
      <button
        onClick={() => navigate({ to: "/partner/queue" })}
        className="mb-4 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All jobs
      </button>
      <PageHeader
        title={order.id}
        subtitle={order.product.name}
        actions={<StatusBadge status={order.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Tailoring instruction
            </div>
            <div className="rounded-md bg-neutral-900 px-4 py-3 text-sm font-medium text-white">
              {order.alteration.standardized || "—"}
            </div>
            {order.alteration.note && (
              <div className="mt-3 text-sm text-neutral-600">
                Customer note: <span className="italic">"{order.alteration.note}"</span>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <UploadCard
              label="Before photo"
              src={order.beforePhoto}
              onClick={() => beforeRef.current?.click()}
            />
            <UploadCard
              label="After photo"
              src={order.afterPhoto}
              onClick={() => afterRef.current?.click()}
            />
            <input
              ref={beforeRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => upload(e, "before")}
            />
            <input
              ref={afterRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => upload(e, "after")}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={startWork}
              className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Start work
            </button>
            <button
              onClick={markComplete}
              className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Mark complete
            </button>
            <button
              onClick={submitQA}
              disabled={!order.beforePhoto || !order.afterPhoto}
              className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              Submit for QA
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Product
            </div>
            <img
              src={order.product.image}
              alt={order.product.name}
              className="aspect-[4/5] w-full rounded-md object-cover"
            />
            <div className="mt-3 text-sm font-medium">{order.product.name}</div>
            <div className="text-xs text-neutral-500">
              Size {order.product.size} · Qty {order.product.qty}
            </div>
          </div>
        </aside>
      </div>
    </Shell>
  );
}

function UploadCard({
  label,
  src,
  onClick,
}: {
  label: string;
  src?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-neutral-300 bg-white text-sm text-neutral-500 hover:border-neutral-900"
    >
      {src ? (
        <img src={src} className="h-full w-full object-cover" alt={label} />
      ) : (
        <>
          <Upload className="h-5 w-5" />
          <span className="mt-2 text-xs">{label}</span>
          <span className="text-[11px] text-neutral-400">Click to upload</span>
        </>
      )}
    </button>
  );
}
