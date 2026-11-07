'use client';
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Search, Zap } from 'lucide-react';
import { validateDomainInput } from '@/lib/billing';

interface HeroProps {
  onSearchDomain: (domain: string) => void;
  onSelectPlan: (planId: 'starter' | 'standard' | 'premium') => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearchDomain, onSelectPlan }) => {
  const [domainQuery, setDomainQuery] = useState('');
  const [selectedTld, setSelectedTld] = useState('.com');

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = domainQuery.trim();
    if (!cleanDomain) return;

    let targetDomain = cleanDomain;
    if (!cleanDomain.includes('.')) {
      targetDomain = `${cleanDomain}${selectedTld}`;
    }
    const validated = validateDomainInput(targetDomain);
    onSearchDomain(validated.normalized);
  };

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
      {/* Background subtle light ambient accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & Domain Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>TechBuilders Cloud · Nigerian Web Hosting &amp; Cloud VPS in Naira (₦)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Blazing Fast African Web Hosting Powered by Pure NVMe SSDs
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Host your website locally in our Lagos Tier III data center with sub-15ms Nigerian latency. Pay seamlessly in Naira via Paystack, Flutterwave, or Bank Transfer. Starter from <strong className="text-emerald-700 font-mono font-semibold">₦7,500/mo</strong>, Standard at <strong className="text-emerald-700 font-mono font-semibold">₦12,000/mo</strong>, and Premium at <strong className="text-emerald-700 font-mono font-semibold">₦15,000/mo</strong>.
            </p>

            {/* Interactive Domain Search Form */}
            <div className="bg-slate-50 border border-slate-200 p-2 sm:p-2.5 rounded-xl shadow-md max-w-2xl">
              <form onSubmit={handleDomainSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={domainQuery}
                    onChange={(e) => setDomainQuery(e.target.value)}
                    placeholder="Find your perfect domain name..."
                    className="w-full pl-11 pr-3 py-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                
                <select
                  value={selectedTld}
                  onChange={(e) => setSelectedTld(e.target.value)}
                  className="px-3 py-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  aria-label="Select domain extension"
                >
                  <option value=".com">.com (₦30,000/yr)</option>
                  <option value=".org.ng">.org.ng (₦20,000/yr)</option>
                  <option value=".com.ng">.com.ng (₦3,500/yr)</option>
                  <option value=".ng">.ng (₦11,500/yr)</option>
                  <option value=".africa">.africa (₦14,000/yr)</option>
                  <option value=".org">.org (₦21,000/yr)</option>
                </select>

                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer"
                >
                  <span>Check Domain</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick extension rate bar */}
              <div className="mt-2.5 pt-2 border-t border-slate-200 px-2 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-y-1">
                <span className="font-medium text-slate-700">Popular Extensions:</span>
                <span className="font-mono text-slate-900 font-semibold">.com ₦30,000</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-slate-900 font-semibold">.org.ng ₦20,000</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-slate-700">.com.ng ₦3,500</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-slate-700">.ng ₦11,500</span>
              </div>
            </div>

            {/* Key benefits list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free .com.ng Domain on Annual</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free AutoSSL on All Sites</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>cPanel + LiteSpeed LSCache</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>99.9% Uptime Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Daily Automated JetBackups</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 Lagos WhatsApp &amp; NOC Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset + Plan Cards Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xl">
              <img
                src="/hero_cloud_datacenter.jpg"
                alt="TechBuilders Cloud Lagos Tier III Datacenter server racks"
                className="w-full h-72 sm:h-80 object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

              {/* Floating specs panel */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span className="font-semibold text-slate-900">Featured Hosting Packages (NGN)</span>
                  <span className="text-emerald-700 font-mono text-[11px] font-bold">Instant Setup</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onSelectPlan('starter')}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-500 text-left transition-colors group cursor-pointer"
                  >
                    <div className="text-[11px] text-slate-500">Starter</div>
                    <div className="text-sm font-bold font-mono text-slate-900 group-hover:text-emerald-600">₦7,500</div>
                    <div className="text-[10px] text-slate-500">20 GB NVMe</div>
                  </button>
                  <button
                    onClick={() => onSelectPlan('standard')}
                    className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-left transition-colors relative cursor-pointer"
                  >
                    <span className="absolute -top-1.5 -right-1 px-1 bg-emerald-600 text-white text-[9px] font-bold rounded">Popular</span>
                    <div className="text-[11px] text-emerald-700 font-semibold">Standard</div>
                    <div className="text-sm font-bold font-mono text-slate-900">₦12,000</div>
                    <div className="text-[10px] text-slate-600">60 GB NVMe</div>
                  </button>
                  <button
                    onClick={() => onSelectPlan('premium')}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-500 text-left transition-colors group cursor-pointer"
                  >
                    <div className="text-[11px] text-slate-500">Premium</div>
                    <div className="text-sm font-bold font-mono text-slate-900 group-hover:text-emerald-600">₦15,000</div>
                    <div className="text-[10px] text-slate-500">150 GB + Ded. IP</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Performance KPI badges */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Nigeria Latency</div>
                <div className="text-base font-bold text-slate-900 font-mono">&lt; 14 ms</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Uptime SLA</div>
                <div className="text-base font-bold text-emerald-700 font-mono">99.98%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Local Payment</div>
                <div className="text-base font-bold text-slate-900">Paystack / Trf</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
