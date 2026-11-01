'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6 text-slate-900">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">System Error</h2>
          <p className="text-sm text-slate-600 mb-6">
            An unexpected error occurred. Please try reloading the application.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
