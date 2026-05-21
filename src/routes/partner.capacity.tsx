import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/Shell";
import { getCapacity, saveCapacity } from "@/lib/store";
import { useStoreTick } from "@/lib/use-store";

export const Route = createFileRoute("/partner/capacity")({
  component: Page,
});

function Page() {
  useStoreTick();
  const cap = getCapacity("u_part");
  const update = (patch: Partial<typeof cap>) => saveCapacity({ ...cap, ...patch });

  return (
    <Shell role="partner">
      <PageHeader
        title="Capacity & availability"
        subtitle="Control your intake and working hours"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-sm font-semibold">Daily capacity</div>
          <p className="mt-1 text-xs text-neutral-500">
            Maximum number of new alterations you can accept per day.
          </p>
          <input
            type="range"
            min={1}
            max={50}
            value={cap.dailyCapacity}
            onChange={(e) => update({ dailyCapacity: Number(e.target.value) })}
            className="mt-4 w-full accent-neutral-900"
          />
          <div className="mt-2 text-2xl font-semibold">{cap.dailyCapacity} jobs/day</div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-sm font-semibold">Intake controls</div>
          <div className="mt-4 space-y-3">
            <Toggle
              label="Pause new intake"
              description="No new jobs will be routed to you."
              checked={cap.paused}
              onChange={(v) => update({ paused: v })}
            />
            <Toggle
              label="Available now"
              description="Show as online to merchants."
              checked={cap.available}
              onChange={(v) => update({ available: v })}
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between rounded-md border border-neutral-100 p-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-neutral-500">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={
          "relative h-6 w-11 rounded-full transition-colors " +
          (checked ? "bg-neutral-900" : "bg-neutral-200")
        }
      >
        <span
          className={
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all " +
            (checked ? "left-5" : "left-0.5")
          }
        />
      </button>
    </div>
  );
}
