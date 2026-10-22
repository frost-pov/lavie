"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setError("That password is not right.");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Stock admin</h1>
      {!configured ? (
        <p className="mt-4 rounded-xl bg-surface p-4 text-sm">
          Set <code className="font-mono">ADMIN_PASSWORD</code> in <code className="font-mono">.env.local</code>{" "}
          and restart the server.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6">
          <label htmlFor="pw" className="text-sm font-medium">
            Password
          </label>
          <input
            id="pw"
            type="password"
            autoComplete="current-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-hairline bg-canvas px-4 outline-none focus:border-ink"
          />
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
          <button
            disabled={busy || !pw}
            className="mt-4 h-12 w-full rounded-full bg-ink font-medium text-canvas transition active:scale-[0.98] disabled:opacity-40"
          >
            {busy ? "Checking" : "Sign in"}
          </button>
        </form>
      )}
    </div>
  );
}
