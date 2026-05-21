import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell, PageHeader, StatusBadge } from "@/components/Shell";
import { getOrders, updateOrder } from "@/lib/store";
import { useStoreTick } from "@/lib/use-store";
import { ArrowLeft, Check, CircleDot } from "lucide-react";

export const Route = createFileRoute("/merchant/orders_/$id")({
  component: Page,
});

const STEPS = [
  "Order Created",
  "Routed",
  "Tailor Accepted",
  "Alteration Started",
  "QA Review",
  "Completed",
  "Dispatched",
];

function Page() {
  useStoreTick();
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const order = getOrders().find((o) => o.id === id);

  if (!order) {
    return (
      <Shell role="merchant">
        <PageHeader title="Order not found" />
        <Link to="/merchant/orders" className="text-sm text-neutral-700 underline">
          Back to orders
        </Link>
      </Shell>
    );
  }

  const stepReached = (label: string) => order.timeline.some((t) => t.label === label);

  const routeJob = () => {
    updateOrder(order.id, (o) => ({
      ...o,
      status: "Routed",
      partnerId: "u_part",
      timeline: [...o.timeline, { label: "Routed", at: new Date().toISOString() }],
    }));
  };

  const markDispatched = () => {
    updateOrder(order.id, (o) => ({
      ...o,
      status: "Dispatched",
      timeline: [...o.timeline, { label: "Dispatched", at: new Date().toISOString() }],
    }));
  };

  return (
    <Shell role="merchant">
      <button
        onClick={() => navigate({ to: "/merchant/orders" })}
        className="mb-4 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All orders
      </button>
      <PageHeader
        title={order.id}
        subtitle={`${order.product.name} · ${order.customer.name}`}
        actions={
          <>
            <StatusBadge status={order.status} />
            {order.status === "New" && (
              <button
                onClick={routeJob}
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
              >
                Route to partner
              </button>
            )}
            {order.status === "Approved" && (
              <button
                onClick={markDispatched}
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
              >
                Mark dispatched
              </button>
            )}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Customer
          </div>
          <div className="space-y-1 text-sm">
            <div className="font-medium">{order.customer.name}</div>
            <div className="text-neutral-600">{order.customer.email}</div>
            <div className="text-neutral-600">{order.customer.phone}</div>
            <div className="text-neutral-600">{order.customer.address}</div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Product
          </div>
          <div className="flex gap-3">
            <img
              src={order.product.image}
              alt={order.product.name}
              className="h-20 w-16 rounded-md object-cover"
            />
            <div className="text-sm">
              <div className="font-medium">{order.product.name}</div>
              <div className="text-neutral-600">Size {order.product.size}</div>
              <div className="text-neutral-600">Qty {order.product.qty}</div>
              <div className="font-medium">${order.product.price}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Alteration
          </div>
          <div className="text-xs text-neutral-500">Customer request</div>
          <div className="text-sm">
            {order.alteration.requested.join(", ") || "—"}
            {order.alteration.note && <span className="italic"> · "{order.alteration.note}"</span>}
          </div>
          <div className="mt-3 text-xs text-neutral-500">Standardized instruction</div>
          <div className="rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white">
            {order.alteration.standardized || "—"}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 text-sm font-semibold">Workflow timeline</div>
        <ol className="relative space-y-3 border-l border-neutral-200 pl-6">
          {STEPS.map((s) => {
            const done = stepReached(s);
            const evt = order.timeline.find((t) => t.label === s);
            return (
              <li key={s} className="relative">
                <span
                  className={
                    "absolute -left-[29px] grid h-5 w-5 place-items-center rounded-full border-2 " +
                    (done
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-300")
                  }
                >
                  {done ? <Check className="h-3 w-3" /> : <CircleDot className="h-2.5 w-2.5" />}
                </span>
                <div className={"text-sm " + (done ? "font-medium" : "text-neutral-400")}>
                  {s}
                </div>
                {evt && (
                  <div className="text-[11px] text-neutral-500">
                    {new Date(evt.at).toLocaleString()}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {(order.beforePhoto || order.afterPhoto) && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {order.beforePhoto && (
            <div className="rounded-xl border border-neutral-200 bg-white p-3">
              <div className="mb-2 text-xs font-medium text-neutral-500">Before</div>
              <img src={order.beforePhoto} className="aspect-[4/3] w-full rounded object-cover" />
            </div>
          )}
          {order.afterPhoto && (
            <div className="rounded-xl border border-neutral-200 bg-white p-3">
              <div className="mb-2 text-xs font-medium text-neutral-500">After</div>
              <img src={order.afterPhoto} className="aspect-[4/3] w-full rounded object-cover" />
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
