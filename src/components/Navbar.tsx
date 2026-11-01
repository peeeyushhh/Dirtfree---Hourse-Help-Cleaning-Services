'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Menu,
  X,
  QrCode,
  Smartphone,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-slate-200/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 leading-none">
                  DIRT<span className="text-emerald-600">FREE</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[9px] uppercase tracking-wide flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 fill-emerald-600" />
                  15m
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                Quick House Help & Safai
              </span>
            </div>
          </Link>

          {/* Minimalist Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#services" className="hover:text-emerald-600 transition-colors">
              Services
            </a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
              How It Works
            </a>
            <a href="#safety" className="hover:text-emerald-600 transition-colors">
              Safety & Guarantee
            </a>
            <a href="#reviews" className="hover:text-emerald-600 transition-colors">
              Reviews
            </a>
            <a href="#cities" className="hover:text-emerald-600 transition-colors">
              Cities
            </a>
          </nav>

          {/* Right Action: Download App CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#download"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Scan QR</span>
            </a>

            <a
              href="#download"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs tracking-wide transition shadow-md shadow-slate-900/15 active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Download App</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl p-4 space-y-3 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              Services
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              How It Works
            </a>
            <a
              href="#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              DirtFree Kavach
            </a>
            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              Download App
            </a>
          </div>

          <a
            href="#download"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs tracking-wide shadow-md"
          >
            <Smartphone className="w-4 h-4 fill-white" />
            <span>Download on Play Store & App Store</span>
          </a>
        </div>
      )}
    </header>
  );
}
