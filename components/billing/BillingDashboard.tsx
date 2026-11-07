'use client';
import React, { useState } from 'react';
import {
  Server,
  FileText,
  Globe,
  LifeBuoy,
  CreditCard,
  Plus,
  Zap,
  AlertCircle,
  ChevronRight,
  Cpu,
  User,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { HostingService, Invoice, RegisteredDomain, SupportTicket, UserProfile, DnsRecord } from '@/types/hosting';
import { formatNaira } from '@/lib/billing';
import { CPanelModal } from './CPanelModal';
import { InvoiceViewModal } from './InvoiceViewModal';
import { PaystackCheckoutModal } from './PaystackCheckoutModal';
import { ClientAgreementModal } from '../ClientAgreementModal';

interface BillingDashboardProps {
  services: HostingService[];
  invoices: Invoice[];
  domains: RegisteredDomain[];
  tickets: SupportTicket[];
  userProfile: UserProfile;
  onOpenOrderWizard: () => void;
  onBackToStorefront: () => void;
  onUpdateServicePhp: (serviceId: string, version: string) => void;
  onPayInvoiceSuccess: (invoiceId: string, method: string, txRef: string) => void;
  onAddDnsRecord: (domainId: string, record: Omit<DnsRecord, 'id'>) => void;
  onToggleDomainAutoRenew: (domainId: string) => void;
  onAddTicketReply: (ticketId: string, message: string) => void;
  onCreateTicket: (subject: string, department: any, priority: any, message: string) => void;
  onTopUpWallet: (amount: number) => void;
}

export const BillingDashboard: React.FC<BillingDashboardProps> = ({
  services,
  invoices,
  domains,
  tickets,
  userProfile,
  onOpenOrderWizard,
  onBackToStorefront,
  onUpdateServicePhp,
  onPayInvoiceSuccess,
  onAddDnsRecord,
  onToggleDomainAutoRenew,
  onAddTicketReply,
  onCreateTicket,
  onTopUpWallet,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'invoices' | 'domains' | 'tickets' | 'wallet'>('overview');

  // Modals state
  const [selectedServiceForCPanel, setSelectedServiceForCPanel] = useState<HostingService | null>(null);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<Invoice | null>(null);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementPlanId, setAgreementPlanId] = useState<'starter' | 'standard' | 'premium'>('standard');

  // New Ticket State
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDept, setNewTicketDept] = useState<'Technical Support' | 'Billing & Accounts' | 'Domain Management' | 'Migrations'>('Technical Support');
  const [newTicketPriority, setNewTicketPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('Medium');
  const [newTicketMessage, setNewTicketMessage] = useState('');

  // Selected Ticket thread
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Domain DNS modal / section state
  const [selectedDomainForDns, setSelectedDomainForDns] = useState<RegisteredDomain | null>(null);
  const [newDnsType, setNewDnsType] = useState<'A' | 'CNAME' | 'MX' | 'TXT'>('A');
  const [newDnsName, setNewDnsName] = useState('');
  const [newDnsValue, setNewDnsValue] = useState('');

  // Wallet top up modal
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState(10000);

  // Search & Filter
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  const unpaidInvoices = invoices.filter((inv) => inv.status === 'unpaid');
  const totalUnpaidAmount = unpaidInvoices.reduce((acc, curr) => acc + curr.total, 0);

  const filteredInvoices = invoices.filter((inv) => {
    if (invoiceFilter === 'paid') return inv.status === 'paid';
    if (invoiceFilter === 'unpaid') return inv.status === 'unpaid';
    return true;
  });

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;
    onCreateTicket(newTicketSubject, newTicketDept, newTicketPriority, newTicketMessage);
    setNewTicketSubject('');
    setNewTicketMessage('');
    setShowNewTicketModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyText.trim() || !selectedTicketId) return;
    onAddTicketReply(selectedTicketId, ticketReplyText);
    setTicketReplyText('');
  };

  const handleAddDnsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomainForDns || !newDnsName.trim() || !newDnsValue.trim()) return;
    onAddDnsRecord(selectedDomainForDns.id, {
      type: newDnsType,
      name: newDnsName.trim(),
      value: newDnsValue.trim(),
      ttl: 3600,
      priority: newDnsType === 'MX' ? 10 : undefined,
    });
    setNewDnsName('');
    setNewDnsValue('');
  };

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Client Portal Header Bar */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Server className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">Client Billing &amp; Hosting Portal</h1>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                  Naira (₦)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Welcome back, <strong className="text-slate-800">{userProfile.name}</strong> · {userProfile.companyName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Wallet balance */}
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
              <span className="text-slate-500">Wallet:</span>
              <span className="font-mono font-bold text-emerald-700">{formatNaira(userProfile.walletBalance)}</span>
              <button
                onClick={() => setShowWalletModal(true)}
                className="ml-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold underline cursor-pointer"
              >
                + Top Up
              </button>
            </div>

            <button
              onClick={onOpenOrderWizard}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Deploy New Service</span>
            </button>

            <button
              onClick={onBackToStorefront}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Back to Storefront
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 border-t border-slate-200 text-xs font-medium">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Server },
            { id: 'services', label: `My Hosting (${services.length})`, icon: Cpu },
            {
              id: 'invoices',
              label: `Invoices & Billing (${invoices.length})`,
              icon: FileText,
              badge: unpaidInvoices.length > 0 ? unpaidInvoices.length : undefined,
            },
            { id: 'domains', label: `Domains (${domains.length})`, icon: Globe },
            { id: 'tickets', label: `Support Tickets (${tickets.length})`, icon: LifeBuoy },
            { id: 'wallet', label: 'Wallet & Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 text-emerald-700 font-bold bg-emerald-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Unpaid Invoices Alert Banner */}
        {unpaidInvoices.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-amber-900">
                  You have {unpaidInvoices.length} outstanding invoice awaiting payment
                </div>
                <div className="text-[11px] text-amber-800">
                  Total unpaid: <strong className="font-mono">{formatNaira(totalUnpaidAmount)}</strong>. Settle via Paystack or Nigerian bank transfer to prevent service suspension.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedInvoiceForPay(unpaidInvoices[0])}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              >
                Pay Outstanding ({formatNaira(totalUnpaidAmount)})
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Active Services</span>
                  <Server className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900 font-mono">{services.length}</div>
                <div className="mt-1 text-[11px] text-slate-500">100% Online in Lagos DC</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Registered Domains</span>
                  <Globe className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900 font-mono">{domains.length}</div>
                <div className="mt-1 text-[11px] text-slate-500">Auto-renew protected</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Unpaid Invoices</span>
                  <FileText className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mt-2 text-2xl font-black text-amber-700 font-mono">
                  {unpaidInvoices.length}
                </div>
                <div className="mt-1 text-[11px] text-slate-500 font-mono">
                  {formatNaira(totalUnpaidAmount)} due
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Support Tickets</span>
                  <LifeBuoy className="w-4 h-4 text-purple-600" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900 font-mono">{tickets.length}</div>
                <div className="mt-1 text-[11px] text-emerald-700 font-semibold">Average response &lt; 20m</div>
              </div>
            </div>

            {/* Active Hosting Accounts List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Active Shared Hosting Accounts</h3>
                  <p className="text-xs text-slate-500">Direct one-click access to cPanel, File Manager, and Webmail</p>
                </div>
                <button
                  onClick={() => setActiveTab('services')}
                  className="text-xs text-emerald-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Services</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {services.map((srv) => (
                  <div key={srv.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-slate-900">{srv.domain}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-bold uppercase">
                          {srv.status}
                        </span>
                        <span className="text-xs text-slate-500 font-medium font-mono">
                          ({srv.planName} · {formatNaira(srv.monthlyPrice)}/mo)
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                        <span>Node: <strong className="text-slate-700 font-mono">{srv.ipAddress}</strong> ({srv.serverLocation})</span>
                        <span>·</span>
                        <span>PHP: <strong className="text-emerald-700 font-mono">{srv.phpVersion}</strong></span>
                        <span>·</span>
                        <span>Next Due: <strong className="text-slate-700">{srv.nextDueDate}</strong></span>
                      </div>
                    </div>

                    {/* Meters & Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-48 text-xs space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>NVMe Storage</span>
                          <span className="font-mono text-slate-700 font-semibold">{srv.diskUsedGB} / {srv.diskLimitGB} GB</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 border border-slate-200">
                          <div
                            className="bg-emerald-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (srv.diskUsedGB / srv.diskLimitGB) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedServiceForCPanel(srv)}
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Login to cPanel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-Column split: Recent Invoices & Support Tickets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Invoices */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Recent Invoices</h3>
                  <button
                    onClick={() => setActiveTab('invoices')}
                    className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {invoices.slice(0, 3).map((inv) => (
                    <div key={inv.id} className="py-3 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-mono font-bold text-slate-900 flex items-center gap-2">
                          <span>{inv.invoiceNumber}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                              inv.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Due: {inv.dateDue}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900">{formatNaira(inv.total)}</span>
                        {inv.status === 'unpaid' ? (
                          <button
                            onClick={() => setSelectedInvoiceForPay(inv)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-amber-600 hover:bg-amber-700 rounded transition-colors cursor-pointer shadow-2xs"
                          >
                            Pay
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedInvoiceForView(inv)}
                            className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          >
                            Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support Tickets Overview */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Recent Support Tickets</h3>
                  <button
                    onClick={() => {
                      setActiveTab('tickets');
                      setShowNewTicketModal(true);
                    }}
                    className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
                  >
                    + Open Ticket
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {tickets.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTicketId(t.id);
                        setActiveTab('tickets');
                      }}
                      className="py-3 cursor-pointer hover:bg-slate-50 transition-colors p-2 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 truncate max-w-[240px]">{t.subject}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{t.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="font-mono text-emerald-700 font-semibold">{t.ticketNumber}</span>
                        <span>·</span>
                        <span>{t.department}</span>
                        <span>·</span>
                        <span className="capitalize text-slate-700">{t.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">My Shared Hosting &amp; Server Instances</h2>
                <p className="text-xs text-slate-500">
                  Manage hosting packages, disk storage limits, PHP engines, and control panel credentials.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setAgreementPlanId('standard');
                    setShowAgreementModal(true);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Client SLA Agreement</span>
                </button>
                <button
                  onClick={onOpenOrderWizard}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Another Package</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {services.map((srv) => (
                <div key={srv.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                  {/* Service Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg font-mono font-bold text-slate-900">{srv.domain}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {srv.status}
                        </span>
                        {srv.dedicatedIp && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                            Dedicated IP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Plan: <strong className="text-emerald-700">{srv.planName}</strong> · Cycle: {srv.billingCycle} ({formatNaira(srv.monthlyPrice)}/month)
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => setSelectedServiceForCPanel(srv)}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Launch cPanel SSO</span>
                      </button>
                      <button
                        onClick={() => {
                          const dom = domains.find((d) => d.domainName === srv.domain);
                          if (dom) {
                            setSelectedDomainForDns(dom);
                            setActiveTab('domains');
                          } else {
                            alert(`DNS managed through nameservers at ns1.techbuilders.cloud / ns2.techbuilders.cloud`);
                          }
                        }}
                        className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        DNS Zone
                      </button>
                      <button
                        onClick={() => {
                          setAgreementPlanId(srv.planId);
                          setShowAgreementModal(true);
                        }}
                        className="px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="View or print official hosting contract for this client domain"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Client SLA</span>
                      </button>
                    </div>
                  </div>

                  {/* Resource Gauges */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-slate-500 text-[11px]">Pure NVMe Disk</div>
                      <div className="font-mono text-sm font-bold text-slate-900">{srv.diskUsedGB} GB / {srv.diskLimitGB} GB</div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (srv.diskUsedGB / srv.diskLimitGB) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-slate-500 text-[11px]">Monthly Bandwidth</div>
                      <div className="font-mono text-sm font-bold text-slate-900">{srv.bandwidthUsedGB} GB / Unmetered</div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                        <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '15%' }} />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-slate-500 text-[11px]">Inodes Usage</div>
                      <div className="font-mono text-sm font-bold text-slate-900">{srv.inodesUsed.toLocaleString()} / {srv.inodesLimit.toLocaleString()}</div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${(srv.inodesUsed / srv.inodesLimit) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-slate-500 text-[11px]">PHP Version</div>
                      <div className="font-mono text-sm font-bold text-emerald-700">PHP {srv.phpVersion}</div>
                      <button
                        onClick={() => setSelectedServiceForCPanel(srv)}
                        className="text-[10px] text-slate-600 hover:text-emerald-700 underline cursor-pointer"
                      >
                        Change version →
                      </button>
                    </div>
                  </div>

                  {/* Technical Server Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs text-slate-500 border-t border-slate-100 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">SERVER NODE IP</span>
                      <span className="text-slate-900 font-semibold">{srv.ipAddress}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">DATACENTER</span>
                      <span className="text-slate-900 font-semibold">{srv.serverLocation}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">CPANEL USERNAME</span>
                      <span className="text-slate-900 font-semibold">{srv.cpanelUsername}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">NEXT RENEWAL DATE</span>
                      <span className="text-slate-900 font-semibold">{srv.nextDueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INVOICES & BILLING */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Invoices &amp; Nigerian Naira Billing</h2>
                <p className="text-xs text-slate-500">
                  Download tax invoices and pay securely via Paystack, Flutterwave, or NIBSS direct transfer.
                </p>
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg text-xs shadow-2xs">
                <button
                  onClick={() => setInvoiceFilter('all')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    invoiceFilter === 'all' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({invoices.length})
                </button>
                <button
                  onClick={() => setInvoiceFilter('unpaid')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    invoiceFilter === 'unpaid' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unpaid ({unpaidInvoices.length})
                </button>
                <button
                  onClick={() => setInvoiceFilter('paid')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    invoiceFilter === 'paid' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Paid ({invoices.filter((i) => i.status === 'paid').length})
                </button>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Invoice Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Total (NGN)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 text-slate-500">{inv.dateCreated}</td>
                      <td className="py-3 px-4 text-slate-600">{inv.dateDue}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{formatNaira(inv.total)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            inv.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedInvoiceForView(inv)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-sans rounded transition-colors cursor-pointer"
                        >
                          View Receipt
                        </button>
                        {inv.status === 'unpaid' && (
                          <button
                            onClick={() => setSelectedInvoiceForPay(inv)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-bold rounded transition-colors cursor-pointer shadow-2xs"
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DOMAINS */}
        {activeTab === 'domains' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Registered Domain Portfolio</h2>
                <p className="text-xs text-slate-500">
                  NiRA certified .ng &amp; .com.ng management, DNS records (A, CNAME, MX), and Nameserver routing.
                </p>
              </div>

              <button
                onClick={onOpenOrderWizard}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Another Domain</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {domains.map((dom) => (
                <div key={dom.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-mono font-bold text-slate-900">{dom.domainName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {dom.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-4">
                        <span>Registered: {dom.registrationDate}</span>
                        <span>·</span>
                        <span>Expires: <strong className="text-slate-900">{dom.expiryDate}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleDomainAutoRenew(dom.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          dom.autoRenew
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Auto-Renew: {dom.autoRenew ? 'ON' : 'OFF'}
                      </button>
                      <button
                        onClick={() => setSelectedDomainForDns(selectedDomainForDns?.id === dom.id ? null : dom)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        {selectedDomainForDns?.id === dom.id ? 'Hide DNS Editor' : 'Manage DNS Records'}
                      </button>
                    </div>
                  </div>

                  {/* Nameservers preview */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-slate-500 font-medium">Assigned Nameservers:</span>
                    {dom.nameservers.map((ns) => (
                      <code key={ns} className="px-2 py-1 rounded bg-slate-50 border border-slate-200 font-mono text-emerald-700 font-semibold">
                        {ns}
                      </code>
                    ))}
                  </div>

                  {/* Interactive DNS Zone Editor (Expanded) */}
                  {selectedDomainForDns?.id === dom.id && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          DNS Zone Records ({dom.domainName})
                        </h4>
                        <span className="text-[11px] text-slate-500">TTL: 3600 (1 Hour)</span>
                      </div>

                      {/* Add DNS Record Form */}
                      <form onSubmit={handleAddDnsSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                        <select
                          value={newDnsType}
                          onChange={(e) => setNewDnsType(e.target.value as any)}
                          className="sm:col-span-2 px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                        >
                          <option value="A">A Record</option>
                          <option value="CNAME">CNAME</option>
                          <option value="MX">MX Record</option>
                          <option value="TXT">TXT / SPF</option>
                        </select>

                        <input
                          type="text"
                          value={newDnsName}
                          onChange={(e) => setNewDnsName(e.target.value)}
                          placeholder="Name / Host (e.g. @, api, mail)"
                          className="sm:col-span-4 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                        />

                        <input
                          type="text"
                          value={newDnsValue}
                          onChange={(e) => setNewDnsValue(e.target.value)}
                          placeholder="Points to value (e.g. 102.164.120.88)"
                          className="sm:col-span-4 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                        />

                        <button
                          type="submit"
                          className="sm:col-span-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                        >
                          Add Record
                        </button>
                      </form>

                      {/* Records Table */}
                      <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-2xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="p-2.5">Type</th>
                              <th className="p-2.5">Host Name</th>
                              <th className="p-2.5">Target Value</th>
                              <th className="p-2.5 text-right">TTL</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                            {dom.dnsRecords.map((rec) => (
                              <tr key={rec.id}>
                                <td className="p-2.5 font-bold text-emerald-700">{rec.type}</td>
                                <td className="p-2.5 text-slate-900">{rec.name}</td>
                                <td className="p-2.5 text-slate-600">{rec.value}</td>
                                <td className="p-2.5 text-right text-slate-500">{rec.ttl}s</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SUPPORT TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Lagos Technical Support &amp; NOC Helpdesk</h2>
                <p className="text-xs text-slate-500">
                  Direct priority communication with our in-house systems administrators and cloud engineers.
                </p>
              </div>

              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Open New Ticket</span>
              </button>
            </div>

            {/* Split layout: Tickets list and conversation view */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Tickets list */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
                {tickets.map((t) => {
                  const isSelected = t.id === activeTicket?.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/60 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-emerald-700">{t.ticketNumber}</span>
                        <span className="text-[10px] text-slate-500">{t.lastUpdated}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{t.subject}</h4>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                        <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {t.status.replace('_', ' ')}
                        </span>
                        <span>·</span>
                        <span>{t.department}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Active Ticket Thread */}
              {activeTicket && (
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col space-y-6">
                  {/* Ticket Header */}
                  <div className="pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-emerald-700">{activeTicket.ticketNumber}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase font-bold text-[10px]">
                        {activeTicket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{activeTicket.subject}</h3>
                    <div className="text-xs text-slate-500 mt-1">
                      Department: {activeTicket.department} · Priority: {activeTicket.priority}
                    </div>
                  </div>

                  {/* Messages Stream */}
                  <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                    {activeTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-xl text-xs space-y-1.5 ${
                          msg.senderRole === 'support'
                            ? 'bg-emerald-50 border border-emerald-200 text-slate-800'
                            : 'bg-slate-50 border border-slate-200 text-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold flex items-center gap-1.5">
                            {msg.senderRole === 'support' && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            <span className={msg.senderRole === 'support' ? 'text-emerald-700' : 'text-slate-700'}>
                              {msg.sender}
                            </span>
                          </span>
                          <span className="text-slate-400 font-mono">{msg.timestamp}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendReply} className="pt-2 border-t border-slate-100 space-y-2">
                    <textarea
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                      placeholder="Type your response to the Lagos support team..."
                      rows={3}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: WALLET & PROFILE */}
        {activeTab === 'wallet' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Naira Prepaid Wallet</h3>
                <span className="font-mono text-xl font-black text-emerald-700">
                  {formatNaira(userProfile.walletBalance)}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pre-funded balance automatically covers your domain and shared hosting renewals, ensuring your websites never experience downtime due to expired debit cards.
              </p>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Top Up Balance</span>
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">Account Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block mb-0.5">Full Name</span>
                  <span className="text-slate-900 font-semibold">{userProfile.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Email Address</span>
                  <span className="text-slate-900 font-semibold">{userProfile.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Phone Number</span>
                  <span className="text-slate-900 font-semibold font-mono">{userProfile.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Company</span>
                  <span className="text-slate-900 font-semibold">{userProfile.companyName}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block mb-0.5">Address</span>
                  <span className="text-slate-900">{userProfile.address}, {userProfile.city}, {userProfile.country}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: cPanel SSO Modal */}
      <CPanelModal
        service={selectedServiceForCPanel}
        isOpen={!!selectedServiceForCPanel}
        onClose={() => setSelectedServiceForCPanel(null)}
        onUpdatePhpVersion={onUpdateServicePhp}
      />

      {/* MODAL 2: Invoice View Modal */}
      <InvoiceViewModal
        invoice={selectedInvoiceForView}
        isOpen={!!selectedInvoiceForView}
        onClose={() => setSelectedInvoiceForView(null)}
        onPayInvoice={(inv) => {
          setSelectedInvoiceForView(null);
          setSelectedInvoiceForPay(inv);
        }}
      />

      {/* MODAL 3: Paystack Checkout Modal */}
      <PaystackCheckoutModal
        invoice={selectedInvoiceForPay}
        isOpen={!!selectedInvoiceForPay}
        onClose={() => setSelectedInvoiceForPay(null)}
        onPaymentSuccess={onPayInvoiceSuccess}
      />

      {/* MODAL 4: New Support Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Open Support Ticket</h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="e.g. Need help with WordPress migration"
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={newTicketDept}
                    onChange={(e) => setNewTicketDept(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing & Accounts">Billing &amp; Accounts</option>
                    <option value="Domain Management">Domain Management</option>
                    <option value="Migrations">Migrations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Message</label>
                <textarea
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  placeholder="Provide full details of your issue..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Wallet Top Up */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Top Up Naira Wallet</h3>
              <button onClick={() => setShowWalletModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-slate-700 font-semibold">Select Top Up Amount (NGN)</label>
              <div className="grid grid-cols-3 gap-2">
                {[5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setWalletAmount(amt)}
                    className={`p-2.5 rounded-lg border font-mono font-bold transition-colors cursor-pointer ${
                      walletAmount === amt
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {formatNaira(amt)}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onTopUpWallet(walletAmount);
                    setShowWalletModal(false);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Fund {formatNaira(walletAmount)} via Paystack
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 6: Client Scope Agreement & SLA */}
      <ClientAgreementModal
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
        selectedPlanId={agreementPlanId}
      />
    </div>
  );
};
