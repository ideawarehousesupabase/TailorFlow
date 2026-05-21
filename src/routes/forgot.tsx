import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field } from "@/components/AuthCard";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/forgot")({
  component: Forgot,
});

function Forgot() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthCard
      title="Reset password"
      subtitle="We'll send a reset link to your email"
      footer={
        <Link to="/login" className="font-medium text-neutral-900 underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          If an account exists for {email}, a reset link has been sent.
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setErr("");
            setLoading(true);
            try {
              await resetPassword(email);
              setSent(true);
            } catch {
              setErr("Could not send reset link. Please check the email and try again.");
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {err && <p className="text-xs text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
