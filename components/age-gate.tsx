"use client";

import { useEffect, useState } from "react";

const KEY = "lavie-age-ok";

export function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "1") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
      className="fixed inset-0 z-[100] grid place-items-center bg-canvas/95 px-6 backdrop-blur-md"
    >
      <div className="w-full max-w-md">
        <p className="font-display text-6xl font-extrabold leading-[0.95] tracking-tight">18+</p>
        <h2 id="age-title" className="mt-4 font-display text-3xl font-bold tracking-tight">
          Adults only.
        </h2>
        <p className="mt-3 text-ink-soft">
          Lavie sells nicotine products. You must be 18 or older to enter this site.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              try {
                localStorage.setItem(KEY, "1");
              } catch {}
              setShow(false);
            }}
            className="h-12 rounded-full bg-ink px-8 font-medium text-canvas transition active:scale-[0.98]"
          >
            I am 18 or older
          </button>
          <a
            href="https://www.google.com"
            className="grid h-12 place-items-center rounded-full border border-hairline px-8 font-medium transition hover:bg-surface"
          >
            Leave
          </a>
        </div>
      </div>
    </div>
  );
}
