'use client';
import React from 'react';
import { Server, ShoppingCart, ArrowRight, Zap, Phone, MessageCircle } from 'lucide-react';
import { COMPANY_PHONE, COMPANY_PHONE_RAW, WHATSAPP_LINK } from '@/lib/paystack';

interface NavbarProps {
  currentView: 'storefront' | 'dashboard';
  setCurrentView: (view: 'storefront' | 'dashboard') => void;
  cartCount?: number;
  openOrderWizard: (planId?: 'starter' | 'standard' | 'premium') => void;
  unpaidInvoiceCount?: number;
  activeServicesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  openOrderWizard,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <Zap className="w-3.5 h-3.5" /> MDXi Lagos Tier III Cloud
            </span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:inline text-slate-600">Pure Enterprise NVMe SSD · 99.9% SLA Guarantee</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 text-xs">
            <span className="hidden md:inline">Instant Paystack Checkout in Naira (₦)</span>
            <a
              href={`tel:${COMPANY_PHONE_RAW}`}
              className="hover:text-emerald-700 font-bold transition-colors flex items-center gap-1.5 text-slate-800"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call / WhatsApp: {COMPANY_PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Bar strictly fulfilling 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={() => setCurrentView('storefront')}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 group-hover:border-emerald-300 transition-all">
            <Server className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
              TechBuilders<span className="text-emerald-600">.cloud</span>
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 single-line clean text links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#pricing"
            onClick={(e) => {
              if (currentView !== 'storefront') {
                e.preventDefault();
                setCurrentView('storefront');
                setTimeout(() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
          >
            Shared Hosting
          </a>
          <a
            href="#domain-checker"
            onClick={(e) => {
              if (currentView !== 'storefront') {
                e.preventDefault();
                setCurrentView('storefront');
                setTimeout(() => {
                  document.getElementById('domain-checker')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
          >
            Domains (.com / .org.ng)
          </a>
          <a
            href="#features"
            onClick={(e) => {
              if (currentView !== 'storefront') {
                e.preventDefault();
                setCurrentView('storefront');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
          >
            Features &amp; cPanel
          </a>
          <a
            href="#infrastructure"
            onClick={(e) => {
              if (currentView !== 'storefront') {
                e.preventDefault();
                setCurrentView('storefront');
                setTimeout(() => {
                  document.getElementById('infrastructure')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
          >
            Lagos Datacenter
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              if (currentView !== 'storefront') {
                e.preventDefault();
                setCurrentView('storefront');
                setTimeout(() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
          >
            FAQs
          </a>
        </nav>

        {/* Zone 3: Primary Action & Direct Phone/WhatsApp */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={`tel:${COMPANY_PHONE_RAW}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Call Support / Sales"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{COMPANY_PHONE}</span>
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>
          <button
            onClick={() => openOrderWizard('standard')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm hover:shadow-emerald-600/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Deploy Hosting</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
