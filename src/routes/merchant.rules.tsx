import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader } from "@/components/Shell";
import { getRules, saveRules, uid } from "@/lib/store";
import { useStoreTick } from "@/lib/use-store";
import { Plus, X } from "lucide-react";

export const Route = createFileRoute("/merchant/rules")({
  component: Page,
});

const ALL_ALTS = [
  "Hemming",
  "Waist Adjustment",
  "Sleeve Shortening",
  "Length Adjustment",
  "Shoulder Adjustment",
  "Taper",
];

function Page() {
  useStoreTick();
  const rules = getRules();
  const [newType, setNewType] = useState("");

  const toggle = (id: string, alt: string) => {
    const r = rules.map((x) =>
      x.id === id
        ? {
            ...x,
            allowed: x.allowed.includes(alt)
              ? x.allowed.filter((a) => a !== alt)
              : [...x.allowed, alt],
          }
        : x,
    );
    saveRules(r);
  };

  const add = () => {
    if (!newType.trim()) return;
    saveRules([...rules, { id: uid("r"), productType: newType.trim(), allowed: [] }]);
    setNewType("");
  };

  const remove = (id: string) => saveRules(rules.filter((r) => r.id !== id));

  return (
    <Shell role="merchant">
      <PageHeader
        title="Product rules"
        subtitle="Configure which alterations are allowed per product type"
      />

      <div className="mb-6 flex gap-2 rounded-xl border border-neutral-200 bg-white p-4">
        <input
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="New product type (e.g. Jackets)"
          className="flex-1 rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <button
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rules.map((r) => (
          <div key={r.id} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-base font-semibold">{r.productType}</div>
              <button
                onClick={() => remove(r.id)}
                className="text-neutral-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_ALTS.map((a) => {
                const on = r.allowed.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggle(r.id, a)}
                    className={
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                      (on
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50")
                    }
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
