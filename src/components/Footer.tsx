'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function Footer() {
  const cities = ['Ghaziabad (Delhi NCR)', 'Ahmedabad', 'Chennai', 'Indore', 'Betul'];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* 4 Pillars Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Zap className="w-5 h-5 fill-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">15-Minute Dispatch</h4>
                <p className="text-[11px] text-slate-400">At your doorstep in minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Police & Aadhaar Vetted</h4>
                <p className="text-[11px] text-slate-400">100% background-checked staff</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">German Equipment</h4>
                <p className="text-[11px] text-slate-400">Zero supplies needed from you</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Pay Post-Service</h4>
                <p className="text-[11px] text-slate-400">Inspect first, pay via UPI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                DIRT<span className="text-emerald-400">FREE</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[9px] uppercase tracking-wider">
                Mobile App
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India&apos;s fastest quick-service platform for on-demand home cleaning and daily household chores. Download our app on Google Play Store and Apple App Store for 15-minute doorstep dispatch.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Helpline: +91 96919 98370</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>support@dirtfree.in</span>
              </div>
            </div>
          </div>

          {/* Download App Links */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3">Download DirtFree</h5>
            <div className="flex flex-col gap-2.5">
              <a
                href="#download"
                className="inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition group"
              >
                <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.036 2.036 0 0 1-.22-.924V2.738c0-.342.08-.66.22-.924zM15.207 13.414l2.585 2.586-11.75 6.78 9.165-9.366zM15.207 10.586L6.042 1.22l11.75 6.78-2.585 2.586zM18.896 11.293l2.88 1.662a.81.81 0 0 1 0 1.403l-2.88 1.662-1.89-1.89 1.89-1.837z" />
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">GET IT ON</div>
                  <div className="text-xs font-bold text-white">Google Play</div>
                </div>
              </a>

              <a
                href="#download"
                className="inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition group"
              >
                <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.58.65-1.09 1.73-.95 2.76.99.08 2.03-.51 2.66-1.26z" />
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Download on the</div>
                  <div className="text-xs font-bold text-white">App Store</div>
                </div>
              </a>
            </div>
          </div>

          {/* Operational Cities */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3">Live Cities</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              {cities.map((city, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{city}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3">Company & Safety</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
              <li><a href="#safety" className="hover:text-white transition">DirtFree Kavach</a></li>
              <li><a href="#services" className="hover:text-white transition">Services & Rates</a></li>
              <li><a href="#reviews" className="hover:text-white transition">Customer Reviews</a></li>
              <li><a href="#download" className="hover:text-white transition">Scan to Download</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 DirtFree Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Instant 15-Min Dispatch</span>
            <span>•</span>
            <span>Zero Advance</span>
            <span>•</span>
            <span>UPI: 9691998370@ybl</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
