'use client';
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  HelpCircle, 
  Clock, 
  AlertCircle,
  HardDrive,
  Mail,
  Zap,
  ArrowRight
} from 'lucide-react';
import { ClientAgreementModal } from './ClientAgreementModal';

export const HostingScopePolicy: React.FC = () => {
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<'starter' | 'standard' | 'premium'>('standard');

  const openAgreement = (planId: 'starter' | 'standard' | 'premium' = 'standard') => {
    setSelectedPlanForModal(planId);
    setIsAgreementModalOpen(true);
  };

  return (
    <section id="client-agreement" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Dispute Client Hosting Agreement &amp; SLA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Clear Plan Boundaries · Never Argue With Clients Again
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            The #1 issue Nigerian agencies and web developers face is clients confusing <strong>Web Hosting</strong> with <strong>Web Development</strong>. We provide crystal-clear scope definitions, resource quotas, and printable binding agreements.
          </p>
        </div>

        {/* Highlight Banner with Instant Agreement Generator */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Agency &amp; Freelancer Feature
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Official Client Web Hosting Contract &amp; Terms
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Generate a formatted, legally sound hosting agreement customized with your client's business name, domain, and chosen tier. Print or save as PDF before launching their website.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            <button
              onClick={() => openAgreement('standard')}
              className="px-5 py-3 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Generate Client Contract</span>
            </button>
            <button
              onClick={() => openAgreement('premium')}
              className="px-5 py-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print SLA Agreement</span>
            </button>
          </div>
        </div>

        {/* 2-Column Clarity Breakdown: What Hosting Covers vs What It Does Not */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {/* Box 1: What Hosting Covers */}
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/50 border-2 border-emerald-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-950">
                    What Web Hosting Strictly Covers
                  </h3>
                  <span className="text-xs text-emerald-700 font-medium">
                    100% Guaranteed by TechBuilders Cloud SLA
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-700 mt-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">99.9% Server &amp; Network Uptime:</strong> High-speed optical connectivity at MDXi Lekki with redundant power backups and generators.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">High-Speed NVMe Storage:</strong> Dedicated space on enterprise Samsung NVMe SSDs (20GB, 60GB, or 150GB).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">cPanel &amp; Database Engine:</strong> MySQL 8.0, phpMyAdmin, and PHP runtime (7.4 to 8.3) with LiteSpeed Web Server.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Free AutoSSL:</strong> Automatic 90-day Let's Encrypt certificate renewals for domain and subdomains.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Daily JetBackups:</strong> Isolated offsite disaster recovery snapshots with 30-day restore capability.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Custom Business Emails:</strong> IMAP/POP3/SMTP mailboxes with Roundcube webmail access.
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-200/60 text-[11px] text-emerald-800 font-medium">
              ✓ TechBuilders Cloud NOC is responsible for all server-side health.
            </div>
          </div>

          {/* Box 2: What Web Hosting DOES NOT Cover (Client / Dev Responsibility) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-rose-50/50 border-2 border-rose-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-950">
                    What Web Hosting Does NOT Include
                  </h3>
                  <span className="text-xs text-rose-700 font-medium">
                    Requires Separate Web Design / Maintenance Contract
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-700 mt-6">
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Website Design &amp; Layout Changes:</strong> Redesigning homepages, updating banners, typography, or styling requires a graphic/web designer.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Plugin Bugs &amp; Code Errors:</strong> Debugging broken WordPress plugins, outdated PHP scripts, or JavaScript errors caused by client themes.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Content Writing &amp; Product Uploads:</strong> Adding eCommerce products, blog articles, writing copywriting, or uploading price lists.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Payment Gateway Approvals:</strong> Submitting KYC documents to Paystack/Flutterwave for live merchant keys.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">SEO &amp; Digital Marketing:</strong> Google search rankings, ad campaigns, and social media traffic generation.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Free Lifetime Domain Renewals:</strong> Domain names (.com / .ng) must be renewed annually before registry expiration.
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-200/60 text-[11px] text-rose-800 font-medium">
              ⚠ If a client asks for these, bill them under a separate development invoice.
            </div>
          </div>
        </div>

        {/* 3 Pillars of Client Protection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">5-Day Grace Period</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              If a client is late on their hosting renewal payment, services remain active for 5 days post-due date. Automated suspension begins on Day 6 with automatic SMS reminders.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-3">
              <HardDrive className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Strict Inode Limits</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              File counts are capped (Starter: 150k, Standard: 350k, Premium: 600k) to prevent one noisy neighbor from slowing down other Nigerian websites on the shared node.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Zero Arguments Guarantee</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Print our pre-formatted Service Agreement or send the link to your client when submitting invoices. It provides complete legal protection under Nigerian commercial trade guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Agreement Modal */}
      <ClientAgreementModal
        isOpen={isAgreementModalOpen}
        onClose={() => setIsAgreementModalOpen(false)}
        selectedPlanId={selectedPlanForModal}
      />
    </section>
  );
};
