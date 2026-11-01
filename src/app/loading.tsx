import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
        <div className="absolute w-6 h-6 rounded-full bg-emerald-500/20 animate-pulse" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400 animate-pulse">
        Loading DirtFree...
      </p>
    </div>
  );
}

