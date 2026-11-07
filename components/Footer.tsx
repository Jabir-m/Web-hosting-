'use client';
import React from 'react';
import { Server, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onGoToDashboard: () => void;
  onSelectPlan: (planId: 'starter' | 'standard' | 'premium') => void;
}

export const Footer: React.FC<FooterProps> = ({ onGoToDashboard, onSelectPlan }) => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Server className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                TechBuilders<span className="text-emerald-600">.cloud</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Nigeria's fastest Tier III cloud hosting platform. Delivering enterprise NVMe SSD shared hosting, cloud VPS, and .ng domain registrations directly billed in Nigerian Naira.
            </p>
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Admiralty Way, Lekki Phase 1, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>+234 (1) 234-5678 · WhatsApp NOC: +234 803 456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>support@techbuilders.cloud · billing@techbuilders.cloud</span>
              </div>
            </div>
          </div>

          {/* Hosting Plans */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Web Hosting
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectPlan('starter')}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  Starter Plan (₦7,500/mo)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPlan('standard')}
                  className="hover:text-emerald-700 transition-colors text-left text-slate-900 font-semibold cursor-pointer"
                >
                  Standard Plan (₦12,000/mo)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPlan('premium')}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  Premium Plan (₦15,000/mo)
                </button>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-700 transition-colors">
                  Cloud VPS Servers
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-700 transition-colors">
                  cPanel Reseller Hosting
                </a>
              </li>
            </ul>
          </div>

          {/* Domains & Tools */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Domains &amp; SSL
            </h4>
            <ul className="space-y-2">
              <li><a href="#domain-checker" className="hover:text-emerald-700 transition-colors">Register .com (₦30,000)</a></li>
              <li><a href="#domain-checker" className="hover:text-emerald-700 transition-colors">Register .org.ng (₦20,000)</a></li>
              <li><a href="#domain-checker" className="hover:text-emerald-700 transition-colors">Register .com.ng (₦3,500)</a></li>
              <li><a href="#domain-checker" className="hover:text-emerald-700 transition-colors">Register .ng Domain</a></li>
              <li><a href="#features" className="hover:text-emerald-700 transition-colors">Free Let's Encrypt SSL</a></li>
              <li><a href="#infrastructure" className="hover:text-emerald-700 transition-colors">MDXi Lagos Network Status</a></li>
            </ul>
          </div>

          {/* Client Portal & Billing */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Client Portal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onGoToDashboard}
                  className="hover:text-emerald-700 transition-colors text-left text-emerald-700 font-semibold cursor-pointer"
                >
                  Client Billing Dashboard →
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToDashboard}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  Pay Invoices (Paystack / Trf)
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToDashboard}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  Open Support Ticket
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToDashboard}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  Manage DNS &amp; Nameservers
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToDashboard}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  One-Click cPanel SSO
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Gateways & Trust Badges Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px]">
            <span className="font-semibold text-slate-800">Accepted Naira Gateways:</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs">Paystack</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs">Flutterwave</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs">Verve Cards</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs">Naira Mastercard / Visa</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs">NIBSS Instant Transfer</span>
          </div>

          <div className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} TechBuilders Cloud Ltd. Registered in Nigeria (RC 1892041).
          </div>
        </div>
      </div>
    </footer>
  );
};
