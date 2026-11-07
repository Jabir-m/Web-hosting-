'use client';
import React from 'react';
import { Server, ShieldCheck, Zap, Activity, MapPin } from 'lucide-react';

export const InfrastructureSection: React.FC = () => {
  return (
    <section id="infrastructure" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image Asset & Peering Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl">
              <img
                src="/lagos_tech_hub.jpg"
                alt="TechBuilders Cloud Lagos Network Operations Center and Tier III Facility"
                className="w-full h-80 object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 text-xs shadow-lg">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>MDXi Lekki Data Center, Lagos, Nigeria</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Direct optical peering with the Internet Exchange Point of Nigeria (IXPN), MTN Nigeria, Airtel, Globacom, and MainOne submarine cables.
                </p>
              </div>
            </div>

            {/* Peering Speeds */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500">Lagos Latency</div>
                <div className="text-lg font-bold text-emerald-700 font-mono">~ 4 ms</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500">Abuja / PH</div>
                <div className="text-lg font-bold text-slate-900 font-mono">14 - 18 ms</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500">West Africa</div>
                <div className="text-lg font-bold text-slate-900 font-mono">&lt; 25 ms</div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
              <Activity className="w-3.5 h-3.5" />
              <span>World-Class African Hosting Hardware</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Why Local Nigerian Cloud Infrastructure Matters
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              When your visitors and customers browse your e-commerce store or web app from Lagos, Abuja, or Port Harcourt, overseas servers in the US or Europe introduce 150ms+ latency. TechBuilders Cloud local Lagos infrastructure guarantees lightning-quick page loads and superior Google SEO ranking.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pure Samsung Enterprise NVMe SSDs</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Up to 7,000 MB/s read and write throughput in hardware RAID 10. Database queries for WooCommerce and WordPress execute up to 20x faster.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">LiteSpeed Enterprise &amp; LSCache</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Handle traffic spikes smoothly with event-driven architecture, HTTP/3, QUIC, and native Redis/Memcached object caching support.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">DDoS Scrubbing &amp; Imunify360 Protection</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Multi-layered AI firewall blocks brute-force attacks, malware injection, and malicious bot scraping automatically without false positives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
