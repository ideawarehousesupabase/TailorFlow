import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field } from "@/components/AuthCard";
import type { Role } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const ROLE_LABEL: Record<Role, string> = {
  merchant: "Merchant",
  partner: "Tailoring Partner",
  qa: "QA Inspector",
};

const ROLE_HOME: Record<Role, string> = {
  merchant: "/merchant/dashboard",
  partner: "/partner/dashboard",
  qa: "/qa/queue",
};

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [role, setRole] = useState<Role>("merchant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate({ to: ROLE_HOME[role] });
    } catch (error: any) {
      setErr(error.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access your TailorFlow workspace"
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-medium text-neutral-900 underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-neutral-700">Role</span>
          <div className="grid grid-cols-3 gap-1.5 rounded-md bg-neutral-100 p-1">
            {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={
                  "rounded px-2 py-1.5 text-xs font-medium transition-colors " +
                  (role === r ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600")
                }
              >
                {ROLE_LABEL[r]}
              </button>
            ))}
          </div>
        </div>
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {err && <p className="text-xs text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="text-right">
          <Link to="/forgot" className="text-xs text-neutral-500 hover:text-neutral-900">
            Forgot password?
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
