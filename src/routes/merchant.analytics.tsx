import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader, Stat } from "@/components/Shell";
import { getOrders } from "@/lib/store";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

export const Route = createFileRoute("/merchant/analytics")({
  component: Page,
});

function Page() {
  const orders = getOrders();
  const counts: Record<string, number> = {};
  orders.forEach((o) => {
    counts[o.product.name] = (counts[o.product.name] ?? 0) + 1;
  });
  const mostAltered = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const monthly = [
    { m: "Jan", returns: 64, prevented: 18 },
    { m: "Feb", returns: 71, prevented: 24 },
    { m: "Mar", returns: 58, prevented: 27 },
    { m: "Apr", returns: 49, prevented: 33 },
    { m: "May", returns: 41, prevented: 38 },
    { m: "Jun", returns: 35, prevented: 44 },
  ];

  return (
    <Shell role="merchant">
      <PageHeader
        title="Analytics"
        subtitle="Business insights powered by alteration data"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Returns prevented" value="$4,820" hint="last 30 days" />
        <Stat label="Alterations / order" value="0.42" />
        <Stat label="Avg fit score" value="8.6" hint="out of 10" />
        <Stat label="Repeat rate" value="34%" hint="+6pp" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-4 text-sm font-semibold">Most altered products</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={mostAltered} layout="vertical" margin={{ left: 30, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1ef" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e5e5" }} />
                <Bar dataKey="count" fill="#171717" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-4 text-sm font-semibold">Return prevention trend</div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={monthly} margin={{ top: 4, right: 10, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1ef" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#737373" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e5e5" }} />
                <Area type="monotone" dataKey="prevented" stroke="#10b981" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="returns" stroke="#a3a3a3" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-3 text-sm font-semibold">Fit trend insights</div>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>• Length adjustments are the most frequent request — consider revising the size chart for Slim Fit Trousers.</li>
          <li>• Waist intake spikes for size 30 — review pattern grading for this size.</li>
          <li>• Oxford Dress Shirt sleeve issues account for 18% of alterations.</li>
        </ul>
      </div>
    </Shell>
  );
}
