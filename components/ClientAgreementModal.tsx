'use client';
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  X, 
  Download,
  Info,
  Clock,
  HardDrive,
  Cpu,
  Mail,
  Server
} from 'lucide-react';
import { formatNaira, HOSTING_PLANS } from '@/lib/billing';

interface ClientAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId?: 'starter' | 'standard' | 'premium';
}

export const ClientAgreementModal: React.FC<ClientAgreementModalProps> = ({
  isOpen,
  onClose,
  selectedPlanId = 'standard',
}) => {
  const [activeTab, setActiveTab] = useState<'agreement' | 'matrix' | 'policy'>('agreement');
  const [clientName, setClientName] = useState('Acme Corporation Ltd');
  const [clientDomain, setClientDomain] = useState('clientwebsite.com.ng');
  const [currentPlan, setCurrentPlan] = useState<'starter' | 'standard' | 'premium'>(selectedPlanId);

  if (!isOpen) return null;

  const plan = HOSTING_PLANS.find((p) => p.id === currentPlan) || HOSTING_PLANS[1];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 print:my-0 print:border-none print:shadow-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official Client Web Hosting Service Agreement &amp; SLA
              </h3>
              <p className="text-xs text-slate-500">
                Clear scope boundaries, resource limits &amp; non-dispute terms for clients
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Hidden on print) */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-2 bg-slate-50/50 print:hidden overflow-x-auto">
          <button
            onClick={() => setActiveTab('agreement')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'agreement'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1.5" />
            Printable Client Contract
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" />
            Included vs. Excluded Scope
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'policy'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 inline mr-1.5" />
            Suspension &amp; Renewal Policies
          </button>
        </div>

        {/* Controls Bar for printable view */}
        {activeTab === 'agreement' && (
          <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-slate-600 block text-[11px] font-medium">Select Plan:</label>
                <select
                  value={currentPlan}
                  onChange={(e) => setCurrentPlan(e.target.value as any)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md font-semibold text-slate-800"
                >
                  <option value="starter">Starter Plan (₦7,500/mo)</option>
                  <option value="standard">Standard Plan (₦12,000/mo)</option>
                  <option value="premium">Premium Plan (₦15,000/mo)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] font-medium">Client / Company Name:</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md text-slate-800 font-medium"
                  placeholder="Client Business Name"
                />
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] font-medium">Domain Name:</label>
                <input
                  type="text"
                  value={clientDomain}
                  onChange={(e) => setClientDomain(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md text-slate-800 font-medium"
                  placeholder="website.com.ng"
                />
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        )}

        {/* Tab 1: Printable Agreement */}
        {activeTab === 'agreement' && (
          <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs leading-relaxed max-h-[68vh] overflow-y-auto print:max-h-none print:overflow-visible">
            {/* Agreement Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                  Web Hosting Service Level Agreement (SLA) &amp; Scope Terms
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Document Ref: TB-SLA-{new Date().getFullYear()}-{currentPlan.toUpperCase()} · Binding Service Terms
                </p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-sm text-emerald-700">TechBuilders.cloud</span>
                <p className="text-[11px] text-slate-500">Tier III Lagos Datacenter</p>
              </div>
            </div>

            {/* Parties Summary Box */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Hosting Provider:</span>
                <p className="font-bold text-slate-900">TechBuilders Cloud Solutions Ltd</p>
                <p className="text-[11px] text-slate-600">MDXi Lekki Data Center, Lagos, Nigeria</p>
                <p className="text-[11px] text-slate-600">support@techbuilders.cloud · +234 (1) 234-5678</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Client / Customer:</span>
                <p className="font-bold text-slate-900">{clientName || 'Client Business Name'}</p>
                <p className="text-[11px] text-slate-600">Assigned Domain: <strong className="font-mono text-emerald-800">{clientDomain || 'clientdomain.com.ng'}</strong></p>
                <p className="text-[11px] text-slate-600">Selected Plan: <strong className="text-slate-900">{plan.name} ({formatNaira(plan.monthlyPrice)}/month)</strong></p>
              </div>
            </div>

            {/* Section 1: Exact Resource Allocations */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                1. Dedicated Hosting Plan Specifications &amp; Resource Limits
              </h2>
              <p className="text-slate-600 mb-3">
                The Client is provisioned the following server quota on an enterprise LiteSpeed Linux container. Exceeding these specifications will require upgrading to the next plan tier:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">NVMe Storage:</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">{plan.specs.storage} Pure NVMe</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Guaranteed RAM / CPU:</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">{plan.specs.ram} / {plan.specs.cpu}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Inode Limit (Total Files):</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">
                    {currentPlan === 'starter' ? '150,000 files' : currentPlan === 'standard' ? '350,000 files' : '600,000 files'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Business Emails:</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">{plan.specs.emails}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Hosting Scope vs Development (The Non-Dispute Clause) */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2 text-rose-700">
                2. Scope Boundaries: Web Hosting vs. Web Design / Development
              </h2>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
                <p className="font-semibold text-amber-900">
                  Notice to Client: Web hosting is strictly the provision of server storage, uptime, and network bandwidth. Web hosting does NOT include website design, coding, content updates, or application troubleshooting.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                  <h3 className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    What TechBuilders Cloud Is Responsible For:
                  </h3>
                  <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside">
                    <li>Maintaining 99.9% hardware, network, and web server uptime.</li>
                    <li>Providing cPanel access, phpMyAdmin, and MySQL database management.</li>
                    <li>Automated 90-day Let's Encrypt SSL certificates issuance and renewal.</li>
                    <li>Configuring mail server (SMTP/IMAP) &amp; preventing server IP blacklisting.</li>
                    <li>Offsite JetBackups automated disaster recovery snapshots.</li>
                    <li>DDoS mitigation and Imunify360 server-level firewall filtering.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2">
                  <h3 className="font-bold text-rose-900 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    What Client / Client's Developer Is Responsible For:
                  </h3>
                  <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside">
                    <li>Website content, page design, graphics, and typography.</li>
                    <li>Updating WordPress core, third-party plugins, and custom themes.</li>
                    <li>Debugging code errors (PHP syntax errors, 500 internal plugin errors).</li>
                    <li>Preventing malicious script uploads via insecure WordPress plugins.</li>
                    <li>Backing up local copies of files before editing production code.</li>
                    <li>Website SEO marketing and payment gateway merchant approvals.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Billing, Invoicing & Suspension Policy */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                3. Payment, Renewal Grace Period &amp; Suspension Policy
              </h2>
              <div className="space-y-2 text-slate-700 text-[11px]">
                <p>
                  <strong>• Invoice Generation:</strong> Renewal invoices are generated automatically fourteen (14) days prior to the expiration date and delivered via email and client billing dashboard.
                </p>
                <p>
                  <strong>• Grace Period:</strong> A 5-day grace period is provided after the due date. On Day 6 of non-payment, the hosting service is automatically suspended by the system to prevent unauthorized resource usage.
                </p>
                <p>
                  <strong>• Data Retention:</strong> Suspended website accounts and database backups are retained for thirty (30) days. Accounts unpaid past 30 days are purged permanently from NVMe storage with zero liability.
                </p>
                <p>
                  <strong>• Domain Renewals:</strong> Domain registrations are regulated by NiRA (.ng/.com.ng) and ICANN. Domains must be settled before expiry; redemption grace recovery incurs official registry penalty fees.
                </p>
              </div>
            </div>

            {/* Signature Block for Print */}
            <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 print:block">
              <div>
                <p className="text-[11px] text-slate-500 mb-8">For Provider (TechBuilders Cloud):</p>
                <div className="border-b border-slate-400 w-48 mb-1"></div>
                <p className="font-bold text-slate-900">Jabir Mustafa Sulaiman</p>
                <p className="text-[10px] text-slate-500">Infrastructure &amp; Operations Lead</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-8">For Client ({clientName || 'Customer'}):</p>
                <div className="border-b border-slate-400 w-48 mb-1"></div>
                <p className="font-bold text-slate-900">Authorized Client Representative</p>
                <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Scope Matrix */}
        {activeTab === 'matrix' && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <h4 className="font-bold text-emerald-900 text-sm mb-1">Clear Boundaries Prevent Arguments</h4>
              <p className="text-xs text-emerald-800">
                Show this table to your client before initiating project handover. It defines exactly what your monthly or annual web hosting fee pays for vs what requires a web design/development contract.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">Service Item / Task</th>
                    <th className="py-3 px-4 text-center">Web Hosting Fee</th>
                    <th className="py-3 px-4 text-center">Web Developer Fee</th>
                    <th className="py-3 px-4">Policy Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Server Online Uptime (99.9%)</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Included</td>
                    <td className="py-3 px-4 text-center text-slate-400">—</td>
                    <td className="py-3 px-4 text-slate-500">We keep the Lagos Tier III hypervisor online 24/7/365.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Creating Business Email Accounts</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Included</td>
                    <td className="py-3 px-4 text-center text-slate-400">—</td>
                    <td className="py-3 px-4 text-slate-500">Create mailboxes anytime via cPanel or ask support.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Free Let's Encrypt SSL</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Included</td>
                    <td className="py-3 px-4 text-center text-slate-400">—</td>
                    <td className="py-3 px-4 text-slate-500">AutoSSL validates and renews automatically every 90 days.</td>
                  </tr>
                  <tr className="bg-rose-50/40">
                    <td className="py-3 px-4 font-semibold text-slate-900">Website Design &amp; Layout Changes</td>
                    <td className="py-3 px-4 text-center text-rose-600 font-bold">✕ Not Included</td>
                    <td className="py-3 px-4 text-center text-slate-900 font-bold">Client Retainer</td>
                    <td className="py-3 px-4 text-slate-600">Editing text, replacing banners, or redesigning headers is development work.</td>
                  </tr>
                  <tr className="bg-rose-50/40">
                    <td className="py-3 px-4 font-semibold text-slate-900">Fixing Broken WordPress Plugins</td>
                    <td className="py-3 px-4 text-center text-rose-600 font-bold">✕ Not Included</td>
                    <td className="py-3 px-4 text-center text-slate-900 font-bold">Client Retainer</td>
                    <td className="py-3 px-4 text-slate-600">If client installs conflicting plugins causing errors, developer must debug.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Automated Daily JetBackups</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Included</td>
                    <td className="py-3 px-4 text-center text-slate-400">—</td>
                    <td className="py-3 px-4 text-slate-500">Snapshots saved daily with 30-day recovery points.</td>
                  </tr>
                  <tr className="bg-rose-50/40">
                    <td className="py-3 px-4 font-semibold text-slate-900">Adding New Products / Content</td>
                    <td className="py-3 px-4 text-center text-rose-600 font-bold">✕ Not Included</td>
                    <td className="py-3 px-4 text-center text-slate-900 font-bold">Client Task</td>
                    <td className="py-3 px-4 text-slate-600">Uploading client store inventory is done by client staff or webmaster.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">PHP Version Switcher (7.4 - 8.3)</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Included</td>
                    <td className="py-3 px-4 text-center text-slate-400">—</td>
                    <td className="py-3 px-4 text-slate-500">Switch PHP versions with 1 click directly in cPanel.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Suspension & Renewal Policies */}
        {activeTab === 'policy' && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">14-Day Advance Notice</h4>
                <p className="text-xs text-slate-600">
                  Renewal invoices are automatically created 14 days before your due date. You receive automated SMS and email reminders with one-click Paystack or bank transfer payment links.
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">5-Day Grace Period</h4>
                <p className="text-xs text-slate-600">
                  If an invoice is unpaid on the due date, websites remain online for 5 additional days. Automated suspension initiates on Day 6 to avoid server resource allocation losses.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <HardDrive className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">30-Day Backup Vault</h4>
                <p className="text-xs text-slate-600">
                  Suspended accounts are safely archived in isolated storage for 30 days. Paying the invoice immediately unsuspends the account with zero data loss.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="font-bold text-slate-900 text-sm mb-2">Refund Policy &amp; Non-Refundable Registry Fees</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hosting server fees are protected by our <strong>30-Day Money-Back Guarantee</strong>. However, domain name registrations (.com, .com.ng, .ng, .org.ng) are instant wholesale registrations with NiRA and ICANN and are strictly non-refundable once registered under the client's name.
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">
            TechBuilders Cloud · Non-Dispute Client Hosting Policy
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Agreement</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
