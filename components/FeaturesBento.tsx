'use client';
import React from 'react';
import { Layers, Shield, Mail, RefreshCw } from 'lucide-react';

export const FeaturesBento: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full mb-3">
            <span>Enterprise Cloud Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for African Developers, Agencies, &amp; Businesses
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Every feature you need to build, launch, and scale high-traffic WordPress websites, Laravel APIs, and Node.js applications.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: cPanel & 1-Click Installer (Spans 2 columns) */}
          <div className="md:col-span-2 rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Full cPanel &amp; Softaculous 1-Click Installer</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Manage your files, MySQL databases, and subdomains effortlessly through industry-standard cPanel. Install over 400+ scripts including WordPress, WooCommerce, Joomla, Laravel, and PrestaShop with a single click.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs">WordPress Toolkit</span>
              <span className="px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs">phpMyAdmin</span>
              <span className="px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs">Git Version Control</span>
              <span className="px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs">Cron Jobs</span>
              <span className="px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs">Staging Clone</span>
            </div>
          </div>

          {/* Card 2: Free Automated SSL */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Free AutoSSL on All Domains</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Let's Encrypt SSL certificates are issued and renewed automatically for your main domain, subdomains, and mail server with 256-bit encryption.
              </p>
            </div>
            <div className="mt-6 text-xs text-emerald-700 font-semibold">
              ✓ Automated 90-day renewal zero downtime
            </div>
          </div>

          {/* Card 3: Free Business Emails */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Custom Professional Emails</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Create branded email addresses like <code className="text-emerald-700 font-semibold">info@yourcompany.com.ng</code> with IMAP, POP3, Roundcube Webmail, and spam filters.
              </p>
            </div>
            <div className="mt-6 text-xs text-slate-500">
              Webmail, Outlook &amp; iOS/Android synced
            </div>
          </div>

          {/* Card 4: Daily JetBackups (Spans 2 columns) */}
          <div className="md:col-span-2 rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Automated JetBackups with 1-Click Restore</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Rest easy knowing your files, databases, and emails are backed up automatically every day to an isolated offsite cloud vault. Restore individual files, databases, or entire accounts in seconds.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Point-in-time snapshot recovery</span>
              <span className="text-emerald-700 font-mono font-semibold">Standard &amp; Premium plans</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
