import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader, Stat } from "@/components/Shell";
import { getOrders } from "@/lib/store";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/merchant/dashboard")({
  component: Page,
});

function Page() {
  const orders = getOrders();
  const active = orders.filter((o) =>
    ["Routed", "In Alteration", "QA Pending"].includes(o.status),
  ).length;
  const inProgress = orders.filter((o) => o.status === "In Alteration").length;
  const completed = orders.filter((o) =>
    ["Approved", "Dispatched"].includes(o.status),
  ).length;

  const trend = [
    { d: "Mon", alterations: 12, fit: 4 },
    { d: "Tue", alterations: 18, fit: 5 },
    { d: "Wed", alterations: 22, fit: 7 },
    { d: "Thu", alterations: 19, fit: 6 },
    { d: "Fri", alterations: 28, fit: 8 },
    { d: "Sat", alterations: 34, fit: 11 },
    { d: "Sun", alterations: 24, fit: 7 },
  ];

  const issueData = [
    { issue: "Length", count: 42 },
    { issue: "Waist", count: 27 },
    { issue: "Sleeve", count: 18 },
    { issue: "Shoulder", count: 9 },
  ];

  return (
    <Shell role="merchant">
      <PageHeader title="Dashboard" subtitle="Overview of your TailorFlow operations" />
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total orders" value={orders.length} />
        <Stat label="Active alterations" value={active} />
        <Stat label="In progress" value={inProgress} />
        <Stat label="Completed" value={completed} />
        <Stat label="Returns prevented" value="$4,820" hint="est. last 30 days" />
        <Stat label="Avg turnaround" value="1.8d" hint="−12% vs prev" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Alteration trends</div>
              <div className="text-xs text-neutral-500">Last 7 days</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ top: 4, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1ef" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e5e5" }} />
                <Line type="monotone" dataKey="alterations" stroke="#171717" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="fit" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold">Fit issue trends</div>
            <div className="text-xs text-neutral-500">By category</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={issueData} margin={{ top: 4, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1ef" vertical={false} />
                <XAxis dataKey="issue" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e5e5" }} />
                <Bar dataKey="count" fill="#171717" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-3 text-sm font-semibold">Recent orders</div>
        <div className="space-y-2">
          {orders.slice(0, 5).map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between rounded-md border border-neutral-100 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-500">{o.id}</span>
                <span className="font-medium">{o.product.name}</span>
                <span className="text-xs text-neutral-500">{o.customer.name}</span>
              </div>
              <span className="text-xs text-neutral-500">{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
