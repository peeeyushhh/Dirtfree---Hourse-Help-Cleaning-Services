'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Smartphone,
  QrCode,
  MapPin,
  Check,
  Phone,
  ChevronDown,
  ChevronRight,
  Award,
  HeartHandshake,
  DollarSign,
  UserCheck,
  Download,
  Share2,
  Copy,
  MessageSquare,
  Send,
} from 'lucide-react';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const APP_URL = 'https://dirtfree.in/app';
  const SHARE_TEXT = `Hi! Here is your official link to download the DirtFree app (Quick House Help & Cleaning in 15 mins): ${APP_URL}`;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    const targetNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(SHARE_TEXT)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setActionSuccess('Opened in WhatsApp! Tap send to deliver the app link.');
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    const smsUrl = `sms:${cleanNumber}?body=${encodeURIComponent(SHARE_TEXT)}`;
    window.location.href = smsUrl;
    setActionSuccess('Opened in Messages! Tap send to deliver the app link.');
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Download DirtFree App',
          text: 'Get professional house help and safai in 15 minutes!',
          url: APP_URL,
        });
      } catch {
        // User dismissed share dialog
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(APP_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const services = [
    {
      title: 'Hourly Home Help & Chores',
      badge: '⚡ 15-Min Arrival',
      desc: 'Utensil scrubbing, dusting, dry/wet floor mopping, laundry folding, and kitchen slab wipe-down.',
      startingPrice: '₹199/hr',
      duration: '60 mins',
      image: '/Images/home-help.jpg',
    },
    {
      title: 'Washroom Deep Descaling & Spa',
      badge: 'Bestseller',
      desc: 'Removal of stubborn hard-water stains, floor & wall tile scrub, toilet descaling, tap buffing & mirror polish.',
      startingPrice: '₹399',
      duration: '60-90 mins',
      image: '/Images/washroom-clean.jpg',
    },
    {
      title: 'Modular Kitchen Deep Degreasing',
      badge: 'Popular',
      desc: 'Intense steam and chemical degreasing of chimney filters, stovetop, backsplash tiles, sink, and exterior cabinets.',
      startingPrice: '₹599',
      duration: '2-3 hours',
      image: '/Images/kitchen-clean.jpg',
    },
    {
      title: '1-4 BHK Full Home Deep Cleaning',
      badge: 'Complete Home',
      desc: 'Complete mechanized single-disc floor buffing, bedrooms, washrooms, kitchen, fans, switches, and balcony scrub.',
      startingPrice: '₹1,499',
      duration: '3-5 hours',
      image: '/Images/full-home-clean.jpg',
    },
    {
      title: 'Sofa & Fabric Upholstery Spa',
      badge: 'Fabric Care',
      desc: 'Deep fabric shampooing with mechanized injection-extraction machine to remove deep dust mites and stubborn stains.',
      startingPrice: '₹499',
      duration: '45-60 mins',
      image: '/Images/sofa-clean.jpg',
    },
    {
      title: 'Doorstep Car Foam Wash & Polish',
      badge: 'Doorstep EV',
      desc: 'High-pressure foam exterior wash, complete interior vacuuming, dashboard UV polish, and ceramic gloss shine.',
      startingPrice: '₹449',
      duration: '60 mins',
      image: '/Images/car-clean.jpg',
    },
  ];

  const faqs = [
    {
      q: 'How does the DirtFree app dispatch cleaners in 15 minutes?',
      a: 'Just like quick-commerce grocery delivery apps (Zepto/Blinkit), DirtFree operates localized neighborhood micro-hubs in every sector. When you tap "Book in 15 Mins", our closest mobile EV crew receives the alert and rides straight to your society with all machinery packed.',
    },
    {
      q: 'Do I need to arrange buckets, cleaners, or machinery?',
      a: 'Zero supplies needed from your side. Our uniform-clad crew carries German single-disc floor scrubbing machines, industrial wet/dry vacuum extractors, high-pressure steam units, and hospital-grade Taski Diversey non-toxic chemicals.',
    },
    {
      q: 'Do I have to pay anything in advance on the app?',
      a: 'Zero advance needed! Inspect the cleanliness jointly with our team supervisor after the service. Once you are 100% satisfied, you can pay directly via UPI (GPay, PhonePe, Paytm to 9691998370@ybl) or Cash.',
    },
    {
      q: 'What is DirtFree Kavach and the 48-Hour Guarantee?',
      a: 'Every booking on the app is protected by DirtFree Kavach: 100% police and Aadhaar verified staff, OTP-secured start and finish, ₹10,000 accidental damage protection, and an unconditional 48-hour free re-clean guarantee if any spot was overlooked.',
    },
    {
      q: 'Is the DirtFree app available for both Android and iPhone?',
      a: 'Yes, DirtFree is available for free download on both Google Play Store for Android and Apple App Store for iOS devices.',
    },
  ];

  return (
    <div className="flex flex-col bg-white text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (3D Material Phone Showcase + App Download)
      ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-100">
        {/* Ambient 3D Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-200/40 via-sky-200/30 to-teal-200/40 blur-[120px] rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Top Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-extrabold text-emerald-700">DIRTFREE APP:</span>
                <span>15-Minute Home Cleaning & Help</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                House Help & Deep Cleaning in{' '}
                <span className="relative inline-block text-emerald-600">
                  <span className="relative z-10">15 Minutes.</span>
                  <span className="absolute bottom-1.5 left-0 w-full h-3 bg-emerald-200/70 -rotate-1 rounded-sm -z-0" />
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                India&apos;s quickest on-demand home cleaning app. Verified professionals arrive at your doorstep in minutes with German single-disc scrubbers & non-toxic chemicals. Zero advance, pay after inspection.
              </p>

              {/* App Store & Play Store Download Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                {/* Google Play Button */}
                <a
                  href="#download"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg shadow-slate-900/15 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 group"
                >
                  <svg className="w-5 h-5 fill-white shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.036 2.036 0 0 1-.22-.924V2.738c0-.342.08-.66.22-.924zM15.207 13.414l2.585 2.586-11.75 6.78 9.165-9.366zM15.207 10.586L6.042 1.22l11.75 6.78-2.585 2.586zM18.896 11.293l2.88 1.662a.81.81 0 0 1 0 1.403l-2.88 1.662-1.89-1.89 1.89-1.837z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">GET IT ON</div>
                    <div className="text-sm font-extrabold text-white">Google Play</div>
                  </div>
                </a>

                {/* Apple App Store Button */}
                <a
                  href="#download"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg shadow-slate-900/15 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 group"
                >
                  <svg className="w-5 h-5 fill-white shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.58.65-1.09 1.73-.95 2.76.99.08 2.03-.51 2.66-1.26z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Download on the</div>
                    <div className="text-sm font-extrabold text-white">App Store</div>
                  </div>
                </a>

                {/* QR Code Pill */}
                <a
                  href="#download"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-sm hover:shadow-md transition active:scale-95"
                >
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <span>Scan to Download</span>
                </a>
              </div>

              {/* Live Availability Line */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500 font-semibold pt-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Live in Ghaziabad (NCR), Ahmedabad, Chennai, Indore & Betul</span>
              </div>

              {/* 4 Trust Metrics */}
              <div className="grid grid-cols-4 gap-2.5 pt-4 border-t border-slate-100 max-w-xl mx-auto lg:mx-0">
                <div className="p-2 rounded-2xl bg-slate-50 text-center">
                  <div className="font-black text-sm sm:text-base text-slate-900">20L+</div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Downloads</div>
                </div>
                <div className="p-2 rounded-2xl bg-slate-50 text-center">
                  <div className="font-black text-sm sm:text-base text-amber-500 flex items-center justify-center gap-0.5">
                    <span>4.9</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">App Rating</div>
                </div>
                <div className="p-2 rounded-2xl bg-slate-50 text-center">
                  <div className="font-black text-sm sm:text-base text-emerald-600">12 Mins</div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Avg Arrival</div>
                </div>
                <div className="p-2 rounded-2xl bg-slate-50 text-center">
                  <div className="font-black text-sm sm:text-base text-sky-600">₹0</div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Advance Fee</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Material Phone App Mockup */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Outer Phone Mockup Frame with 3D Depth */}
              <div className="relative w-[285px] sm:w-[315px] h-[580px] sm:h-[630px] rounded-[48px] bg-slate-950 p-3.5 shadow-2xl phone-mockup-3d">
                {/* Dynamic Island Pill */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>

                {/* Inner Screen Canvas */}
                <div className="w-full h-full rounded-[40px] bg-slate-900 overflow-hidden text-white flex flex-col justify-between p-4 pt-10 select-none relative">
                  {/* Subtle Screen Wallpaper */}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pointer-events-none" />

                  {/* Top Bar inside App */}
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-bold text-slate-200">Indirapuram, Ghaziabad</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>

                    {/* Live Dispatch Pill inside App */}
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-emerald-400" />
                          <span>TEAM ASSIGNED</span>
                        </span>
                        <span className="font-mono">ETA: 11 MINS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
                          DF
                        </div>
                        <div className="leading-tight">
                          <span className="text-xs font-bold text-white block">Sunita &amp; Pooja (Team #4)</span>
                          <span className="text-[10px] text-slate-400">On EV • German Machine Ready</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Services Grid inside App */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Available in 15 Mins:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-left">
                        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-base block mb-0.5">🧹</span>
                          <span className="text-[11px] font-bold text-white block">1-3 BHK Clean</span>
                          <span className="text-[10px] text-emerald-400 font-extrabold">₹1,499</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-base block mb-0.5">🚿</span>
                          <span className="text-[11px] font-bold text-white block">Washroom Spa</span>
                          <span className="text-[10px] text-emerald-400 font-extrabold">₹399</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-base block mb-0.5">🍳</span>
                          <span className="text-[11px] font-bold text-white block">Kitchen Degrease</span>
                          <span className="text-[10px] text-emerald-400 font-extrabold">₹599</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-base block mb-0.5">⏱️</span>
                          <span className="text-[11px] font-bold text-white block">Hourly Help</span>
                          <span className="text-[10px] text-emerald-400 font-extrabold">₹199/hr</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action inside App */}
                  <div className="relative z-10 space-y-2 pt-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-semibold">
                      <span>🔒 Start OTP: 4921</span>
                      <span>₹0 Advance • Pay via UPI</span>
                    </div>
                    <div className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-black text-xs text-center shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Tap to Book in 15 Min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating 3D Badge 1: 12 Mins Arrival */}
              <div className="hidden sm:flex absolute -top-4 -left-6 material-card px-4 py-2.5 rounded-2xl items-center gap-2 shadow-xl animate-bounce duration-1000">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4 fill-emerald-600" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Quick Response</span>
                  <span className="text-xs font-black text-slate-900">12 Mins Doorstep</span>
                </div>
              </div>

              {/* Floating 3D Badge 2: Police Verified */}
              <div className="hidden sm:flex absolute -bottom-6 -right-6 material-card px-4 py-2.5 rounded-2xl items-center gap-2 shadow-xl">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">100% Background Vetted</span>
                  <span className="text-xs font-black text-slate-900">Police &amp; Aadhaar Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CORE APP ADVANTAGES (3D Material Minimalist Cards)
      ────────────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>The DirtFree Difference</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why 20 Lakh+ Families Rely on DirtFree App
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Engineered like modern quick-commerce — instantaneous, transparent, and completely worry-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="material-card p-6 sm:p-7 rounded-3xl space-y-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6 fill-emerald-600" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">15-Min Doorstep Dispatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Book on the app, and our mobile electric service team arrives in 12–15 minutes. No waiting for days.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="material-card p-6 sm:p-7 rounded-3xl space-y-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">100% Police Verified Staff</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Aadhaar authenticated, police background checked, and trained in a 14-day rigorous hygiene bootcamp.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="material-card p-6 sm:p-7 rounded-3xl space-y-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">German Machinery &amp; Taski</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Zero supplies from you. We bring industrial single-disc floor scrubbers, wet extractors, and safe chemicals.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="material-card p-6 sm:p-7 rounded-3xl space-y-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Pay Post-Service via UPI</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              ₹0 advance needed. Joint inspection with supervisor, then transfer via UPI (GPay/PhonePe to 9691998370@ybl).
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SERVICES AVAILABLE ON APP (Showcase Grid)
      ────────────────────────────────────────────────────────────── */}
      <section id="services" className="py-16 sm:py-24 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 block mb-1">
                Book Instantly on DirtFree App
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Popular Services On The App
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fixed transparent rates • Zero advance fee • 100% satisfaction guarantee
              </p>
            </div>

            <a
              href="#download"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              <span>Download app to explore all 85+ services</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-xs text-white font-extrabold text-[10px] tracking-wider uppercase">
                      {svc.badge}
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{svc.duration}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                      Starts From
                    </span>
                    <span className="text-lg font-black text-slate-900">{svc.startingPrice}</span>
                  </div>

                  <a
                    href="#download"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs transition flex items-center gap-1"
                  >
                    <span>Book on App</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. HOW IT WORKS (3 Simple Steps)
      ────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 block mb-1">
            Frictionless Chores
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How DirtFree Works in 3 Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            From tap to spotless doorstep in under 15 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="material-card p-7 rounded-3xl relative overflow-hidden">
            <span className="font-black text-6xl text-slate-100 absolute top-4 right-5 select-none">
              01
            </span>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-base mb-4 relative z-10">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-1 relative z-10">
              1. Tap &amp; Book on App
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed relative z-10">
              Select flat size or hourly chores. Choose <strong>Instant (15-Min Arrival)</strong> or pick a convenient future slot.
            </p>
          </div>

          <div className="material-card p-7 rounded-3xl relative overflow-hidden">
            <span className="font-black text-6xl text-slate-100 absolute top-4 right-5 select-none">
              02
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-base mb-4 relative z-10">
              <Zap className="w-6 h-6 fill-emerald-600" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-1 relative z-10">
              2. Expert Arrives in 15 Mins
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed relative z-10">
              Background-verified crew rides to your society with German scrubbers &amp; Taski chemicals. Zero supplies needed from you.
            </p>
          </div>

          <div className="material-card p-7 rounded-3xl relative overflow-hidden">
            <span className="font-black text-6xl text-slate-100 absolute top-4 right-5 select-none">
              03
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-base mb-4 relative z-10">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-1 relative z-10">
              3. Inspect &amp; Pay via UPI
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed relative z-10">
              Joint inspection with our team supervisor before payment. Once 100% satisfied, pay via UPI to 9691998370@ybl.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. DIRTFREE KAVACH (Safety, Trust & Guarantee)
      ────────────────────────────────────────────────────────────── */}
      <section id="safety" className="py-16 sm:py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DirtFree Kavach</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Safety, Trust &amp; Quality Guarantee
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Every booking on the DirtFree app is protected by 4 ironclad assurances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">100% Police Verified</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Government Aadhaar authentication, criminal background check, and continuous supervisor evaluation.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">German Single-Disc Tools</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Industrial scrubbers, extraction vacuums, and hospital-grade Taski Diversey non-toxic chemicals.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">48-Hour Free Re-Clean</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                If anything was missed during service, notify via app within 48h. We will re-clean it 100% free of charge.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Pay Post-Service via UPI</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Zero advance. Inspect premises first, then complete payment with any UPI app to 9691998370@ybl.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. REVIEWS & SOCIAL PROOF
      ────────────────────────────────────────────────────────────── */}
      <section id="reviews" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500 block mb-1">
            Loved By 20 Lakh+ Families
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Customer Reviews From App Users
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real reviews from apartment residents using the DirtFree mobile app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Ananya Mishra',
              society: 'ATS Advantage, Indirapuram (Ghaziabad)',
              comment:
                'Downloaded the app after Diwali guests left. The crew arrived in exactly 14 minutes! Their single-disc floor scrubber made tiles look brand new. Paying via UPI post-service was seamless.',
              rating: 5,
            },
            {
              name: 'Karan &amp; Ritu Patel',
              society: 'Adani Shantigram, SG Highway (Ahmedabad)',
              comment:
                'The yellow grease on our kitchen chimney filters was completely dissolved with their steam tool. Very professional crew, wore shoe covers throughout. Superb app!',
              rating: 5,
            },
            {
              name: 'Suresh Narayanan',
              society: 'Hiranandani Parks, Oragadam (Chennai)',
              comment:
                'Booked hourly home help on Sunday morning on the app. Two cleaners arrived in 15 mins with all Taski chemicals. Got my fabric sofa cleaned and dust wiped. Super fast!',
              rating: 5,
            },
          ].map((rev, idx) => (
            <div
              key={idx}
              className="material-card p-6 rounded-3xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900">{rev.name}</h5>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {rev.society}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  Verified User
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. MEGA APP DOWNLOAD CALLOUT SECTION (#download)
      ────────────────────────────────────────────────────────────── */}
      <section id="download" className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 to-black text-white relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Download CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                <span>Instant Doorstep Safai on Your Phone</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Download DirtFree App &amp; Experience 15-Min Safai.
              </h2>

              <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                Available now on Google Play Store and Apple App Store. Scan the QR code or enter your mobile number to get the direct download link.
              </p>

              {/* Play Store & App Store Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-xl hover:bg-slate-100 transition active:scale-95 group"
                >
                  <svg className="w-5 h-5 fill-slate-900 shrink-0" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.036 2.036 0 0 1-.22-.924V2.738c0-.342.08-.66.22-.924zM15.207 13.414l2.585 2.586-11.75 6.78 9.165-9.366zM15.207 10.586L6.042 1.22l11.75 6.78-2.585 2.586zM18.896 11.293l2.88 1.662a.81.81 0 0 1 0 1.403l-2.88 1.662-1.89-1.89 1.89-1.837z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">GET IT ON</div>
                    <div className="text-sm font-extrabold text-slate-900">Google Play</div>
                  </div>
                </a>

                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-xl hover:bg-slate-100 transition active:scale-95 group"
                >
                  <svg className="w-5 h-5 fill-slate-900 shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.58.65-1.09 1.73-.95 2.76.99.08 2.03-.51 2.66-1.26z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Download on the</div>
                    <div className="text-sm font-extrabold text-slate-900">App Store</div>
                  </div>
                </a>
              </div>

              {/* Free Link Delivery to User's Phone */}
              <div className="pt-2 space-y-3 max-w-md mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    maxLength={10}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full sm:flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 text-xs font-semibold focus:outline-hidden focus:border-emerald-400"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs tracking-wide shrink-0 transition shadow-lg shadow-emerald-500/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSendSms}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs tracking-wide shrink-0 transition"
                      title="Send via native SMS"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>SMS</span>
                    </button>
                  </div>
                </div>

                {/* Instant Share & Copy Link fallback */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>100% Free • No registration required</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="inline-flex items-center gap-1 hover:text-emerald-400 transition"
                    >
                      <Share2 className="w-3 h-3" />
                      Share
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1 hover:text-emerald-400 transition"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedLink ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>

                {actionSuccess && (
                  <p className="text-xs text-emerald-400 font-bold animate-pulse">
                    ✓ {actionSuccess}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: 3D Material QR Code Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="material-card-dark p-7 rounded-[40px] text-center space-y-4 max-w-xs w-full shadow-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan with Phone Camera</span>
                </div>

                {/* High-Res QR Code */}
                <div className="p-3 bg-white rounded-3xl mx-auto w-48 h-48 flex items-center justify-center shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=https%3A%2F%2Fdirtfree.in%2Fapp"
                    alt="Scan to Download DirtFree App"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-white block">Compatible with iOS &amp; Android</span>
                  <span className="text-[10px] text-slate-400 block">Instant Doorstep Safai in 15 Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FAQ SECTION
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Everything you need to know about the DirtFree app.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
