import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field } from "@/components/AuthCard";
import type { Role } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [role, setRole] = useState<Role>("merchant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signUp(email, password, { name, role, company });
      navigate({
        to:
          role === "merchant"
            ? "/merchant/dashboard"
            : role === "partner"
              ? "/partner/dashboard"
              : "/qa/queue",
      });
    } catch (error: any) {
      setErr(error.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join TailorFlow in seconds"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-neutral-900 underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-neutral-700">I am a</span>
          <div className="grid grid-cols-3 gap-1.5 rounded-md bg-neutral-100 p-1">
            {(["merchant", "partner", "qa"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={
                  "rounded px-2 py-1.5 text-xs font-medium capitalize transition-colors " +
                  (role === r ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600")
                }
              >
                {r === "qa" ? "QA" : r}
              </button>
            ))}
          </div>
        </div>
        <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Field label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {err && <p className="text-xs text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
