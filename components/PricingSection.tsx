'use client';
import React, { useState } from 'react';
import { Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  HOSTING_PLANS,
  BILLING_CYCLES,
  BillingCycle,
  calculateHostingCost,
  formatNaira,
} from '@/lib/billing';

interface PricingSectionProps {
  onSelectPlan: (planId: 'starter' | 'standard' | 'premium', cycle: BillingCycle) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly');
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full mb-3">
            <span>Transparent Naira Pricing · No Dollar Card Required</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            High-Performance Shared Hosting Plans
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Choose the ideal cloud hosting package for your website or web app. All plans run on pure enterprise NVMe SSD storage with LiteSpeed web server and 24/7 Lagos tech support.
          </p>

          {/* Billing Cycle Selector */}
          <div className="mt-8 inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-xs max-w-full overflow-x-auto">
            {(Object.keys(BILLING_CYCLES) as BillingCycle[]).map((cycleKey) => {
              const cycle = BILLING_CYCLES[cycleKey];
              const isSelected = selectedCycle === cycleKey;
              return (
                <button
                  key={cycleKey}
                  onClick={() => setSelectedCycle(cycleKey)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{cycle.name}</span>
                  {cycle.discountPercent > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      -{Math.round(cycle.discountPercent)}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {BILLING_CYCLES[selectedCycle].freeDomainEligible && (
            <div className="mt-3 text-xs text-emerald-700 font-semibold">
              🎁 Annual plan bonus: Includes a free .com.ng or .ng domain registration for the first year!
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {HOSTING_PLANS.map((plan) => {
            const cost = calculateHostingCost(plan.id, selectedCycle);
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-2xl p-6 sm:p-8 transition-all relative ${
                  isPopular
                    ? 'bg-white border-2 border-emerald-600 shadow-xl'
                    : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    {plan.id === 'premium' && (
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                        Dedicated IP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 min-h-[32px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Pricing Display */}
                  <div className="mt-6 pb-6 border-b border-slate-200">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                        {formatNaira(cost.effectiveMonthly)}
                      </span>
                      <span className="text-sm font-medium text-slate-500">/ month</span>
                    </div>

                    {selectedCycle !== 'monthly' && (
                      <div className="mt-1 text-xs text-slate-500 font-mono">
                        Billed {formatNaira(cost.finalTotal)} for {BILLING_CYCLES[selectedCycle].months} months{' '}
                        {cost.discountAmount > 0 && (
                          <span className="text-emerald-700 font-medium">
                            (Saved {formatNaira(cost.discountAmount)})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Core Hardware & Limits */}
                  <div className="mt-6 space-y-3.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.specs.websites}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong className="text-slate-900">{plan.specs.storage}</strong> {plan.specs.storageType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.specs.bandwidth}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.specs.emails}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {plan.specs.ram} · {plan.specs.cpu}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.specs.webServer}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.specs.cpanel}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.specs.ssl}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.specs.backups}</span>
                    </div>
                    {plan.specs.dedicatedIp && (
                      <div className="flex items-center gap-2.5 text-purple-700 font-medium">
                        <Check className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Dedicated Clean IPv4 Address included</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => onSelectPlan(plan.id, selectedCycle)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isPopular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Order Now &amp; Configure</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="mt-2.5 text-center text-[11px] text-slate-500">
                    Instant automated provisioning in Lagos Data Center
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Comparison Toggle */}
        <div className="mt-14 text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>{showComparison ? 'Hide Detailed Spec Comparison' : 'Compare All Technical Specifications'}</span>
            {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Detailed Table (Expanded) */}
        {showComparison && (
          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm p-4">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-900 font-bold bg-slate-50">
                  <th className="py-3 px-4">Feature / Specification</th>
                  <th className="py-3 px-4">Starter (₦7,500/mo)</th>
                  <th className="py-3 px-4 text-emerald-700">Standard (₦12,000/mo)</th>
                  <th className="py-3 px-4">Premium (₦15,000/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">NVMe SSD Storage</td>
                  <td className="py-3 px-4 font-mono">20 GB Pure NVMe</td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">60 GB Pure NVMe</td>
                  <td className="py-3 px-4 font-mono">150 GB Pure NVMe</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">CPU &amp; Dedicated RAM</td>
                  <td className="py-3 px-4">1 Core (3.4GHz) / 2 GB RAM</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">2 Cores (3.4GHz) / 4 GB RAM</td>
                  <td className="py-3 px-4">4 Cores (3.8GHz) / 8 GB RAM</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Inodes Limit</td>
                  <td className="py-3 px-4 font-mono">150,000 Inodes</td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">350,000 Inodes</td>
                  <td className="py-3 px-4 font-mono">600,000 Inodes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Hosted Domains</td>
                  <td className="py-3 px-4">1 Single Website</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">Unlimited Websites</td>
                  <td className="py-3 px-4 font-bold text-slate-900">Unlimited Websites</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Web Server Architecture</td>
                  <td className="py-3 px-4">LiteSpeed Standard</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">LiteSpeed Enterprise + LSCache</td>
                  <td className="py-3 px-4">LiteSpeed Enterprise + Redis Cache</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Dedicated IPv4 Address</td>
                  <td className="py-3 px-4 text-slate-400">Optional (+₦3,500/mo)</td>
                  <td className="py-3 px-4 text-slate-400">Optional (+₦3,500/mo)</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">Included (1 Dedicated IP)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Automated Backups</td>
                  <td className="py-3 px-4">Weekly Snapshots</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Daily JetBackups</td>
                  <td className="py-3 px-4">Daily Continuous (30-day retention)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Free Domain on Annual</td>
                  <td className="py-3 px-4 text-slate-400">Not included</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">Free .com.ng</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">Free .ng or .com.ng</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Control Panel</td>
                  <td className="py-3 px-4">cPanel / DirectAdmin</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">cPanel + Softaculous 1-Click</td>
                  <td className="py-3 px-4">cPanel + VIP Tools + Staging</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
