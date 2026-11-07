'use client';
import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { PricingSection } from './PricingSection';
import { DomainChecker } from './DomainChecker';
import { InfrastructureSection } from './InfrastructureSection';
import { FeaturesBento } from './FeaturesBento';
import { TestimonialsFaq } from './TestimonialsFaq';
import { Footer } from './Footer';
import { OrderWizardModal } from './OrderWizardModal';
import { BillingDashboard } from '@/components/billing/BillingDashboard';

import {
  INITIAL_SERVICES,
  INITIAL_INVOICES,
  INITIAL_DOMAINS,
  INITIAL_TICKETS,
  INITIAL_USER_PROFILE,
} from '@/lib/mockData';
import { HostingService, Invoice, RegisteredDomain, SupportTicket, DnsRecord } from '@/types/hosting';
import { formatNaira } from '@/lib/billing';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'storefront' | 'dashboard'>('storefront');

  // Core Persistent State
  const [services, setServices] = useState<HostingService[]>(INITIAL_SERVICES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [domains, setDomains] = useState<RegisteredDomain[]>(INITIAL_DOMAINS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);

  // Order Wizard State
  const [isOrderWizardOpen, setIsOrderWizardOpen] = useState(false);
  const [selectedPlanForOrder, setSelectedPlanForOrder] = useState<'starter' | 'standard' | 'premium'>('standard');
  const [selectedDomainForOrder, setSelectedDomainForOrder] = useState('');

  // Floating Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenOrderWizard = (
    planId: 'starter' | 'standard' | 'premium' = 'standard',
    domain: string = ''
  ) => {
    setSelectedPlanForOrder(planId);
    setSelectedDomainForOrder(domain);
    setIsOrderWizardOpen(true);
  };

  const handleOrderComplete = (newService: HostingService, newInvoice: Invoice) => {
    setServices((prev) => [newService, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);

    if (!domains.some((d) => d.domainName === newService.domain)) {
      const newDomain: RegisteredDomain = {
        id: `dom-${Date.now()}`,
        domainName: newService.domain,
        registrationDate: new Date().toISOString().slice(0, 10),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        status: 'active',
        autoRenew: true,
        whoisPrivacy: true,
        nameservers: ['ns1.techbuilders.cloud', 'ns2.techbuilders.cloud'],
        dnsRecords: [
          { id: `dns-${Date.now()}-1`, type: 'A', name: '@', value: newService.ipAddress, ttl: 3600 },
          { id: `dns-${Date.now()}-2`, type: 'CNAME', name: 'www', value: newService.domain, ttl: 3600 },
        ],
      };
      setDomains((prev) => [newDomain, ...prev]);
    }

    triggerToast(`🎉 ${newService.planName} provisioned successfully on ${newService.domain}!`);
    setCurrentView('dashboard');
  };

  const handlePayInvoiceSuccess = (invoiceId: string, method: string, txRef: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'paid',
              datePaid: 'Today',
              paymentMethod: method as any,
              transactionRef: txRef,
            }
          : inv
      )
    );
    triggerToast(`✓ Payment confirmed! Invoice settled via ${method}.`);
  };

  const handleUpdateServicePhp = (serviceId: string, phpVersion: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, phpVersion } : s))
    );
    triggerToast(`PHP version updated to ${phpVersion} for service ${serviceId}.`);
  };

  const handleAddDnsRecord = (domainId: string, record: DnsRecord) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.id === domainId ? { ...d, dnsRecords: [...d.dnsRecords, record] } : d
      )
    );
    triggerToast(`DNS record added: ${record.type} ${record.name}`);
  };

  const handleToggleDomainAutoRenew = (domainId: string) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.id === domainId ? { ...d, autoRenew: !d.autoRenew } : d
      )
    );
  };

  const handleAddTicketReply = (ticketId: string, message: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const clientReply = {
            id: `msg-${Date.now()}`,
            sender: userProfile.name,
            senderRole: 'client' as const,
            timestamp: 'Just now',
            message,
          };
          setTimeout(() => {
            const botReply = {
              id: `msg-${Date.now()}-bot`,
              sender: 'Oladipo Adeleke (Lagos NOC Lead)',
              senderRole: 'support' as const,
              timestamp: 'Just now',
              message:
                'Thank you for the update! We have verified the configuration on the Lagos hypervisor node. All services are operating smoothly with 100% health check passes.',
            };
            setTickets((prev2) =>
              prev2.map((t2) => {
                if (t2.id === ticketId) {
                  return {
                    ...t2,
                    status: 'answered' as const,
                    lastUpdated: 'Just now',
                    messages: [...t2.messages, botReply],
                  };
                }
                return t2;
              })
            );
            triggerToast('New reply received from Lagos NOC Support Engineer');
          }, 3200);
          return {
            ...t,
            status: 'customer_reply' as const,
            lastUpdated: 'Just now',
            messages: [...t.messages, clientReply],
          };
        }
        return t;
      })
    );
  };

  const handleCreateTicket = (subject: string, department: any, priority: any, message: string) => {
    const newT: SupportTicket = {
      id: `tik-${Date.now()}`,
      ticketNumber: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      department,
      priority,
      status: 'open',
      lastUpdated: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: userProfile.name,
          senderRole: 'client',
          timestamp: 'Just now',
          message,
        },
      ],
    };
    setTickets((prev) => [newT, ...prev]);
    triggerToast(`Ticket ${newT.ticketNumber} opened. Assigned to ${department}.`);
  };

  const handleTopUpWallet = (amount: number) => {
    setUserProfile((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    triggerToast(`✓ Credited ${formatNaira(amount)} to your Naira wallet via Paystack!`);
  };

  const unpaidCount = invoices.filter((i) => i.status === 'unpaid').length;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={0}
        openOrderWizard={(planId) => handleOpenOrderWizard(planId || 'standard')}
        unpaidInvoiceCount={unpaidCount}
        activeServicesCount={services.length}
      />

      {currentView === 'storefront' ? (
        <main className="flex-1">
          <Hero
            onSearchDomain={(domain) => handleOpenOrderWizard('standard', domain)}
            onSelectPlan={(planId) => handleOpenOrderWizard(planId)}
          />
          <PricingSection
            onSelectPlan={(planId) => handleOpenOrderWizard(planId)}
          />
          <DomainChecker
            onSelectDomainForHosting={(domain) => handleOpenOrderWizard('standard', domain)}
          />
          <InfrastructureSection />
          <FeaturesBento />
          <TestimonialsFaq />
          <Footer
            onGoToDashboard={() => setCurrentView('dashboard')}
            onSelectPlan={(planId) => handleOpenOrderWizard(planId)}
          />
        </main>
      ) : (
        <main className="flex-1">
          <BillingDashboard
            services={services}
            invoices={invoices}
            domains={domains}
            tickets={tickets}
            userProfile={userProfile}
            onOpenOrderWizard={() => handleOpenOrderWizard('standard')}
            onBackToStorefront={() => setCurrentView('storefront')}
            onUpdateServicePhp={handleUpdateServicePhp}
            onPayInvoiceSuccess={handlePayInvoiceSuccess}
            onAddDnsRecord={handleAddDnsRecord}
            onToggleDomainAutoRenew={handleToggleDomainAutoRenew}
            onAddTicketReply={handleAddTicketReply}
            onCreateTicket={handleCreateTicket}
            onTopUpWallet={handleTopUpWallet}
          />
        </main>
      )}

      <OrderWizardModal
        initialPlanId={selectedPlanForOrder}
        initialDomain={selectedDomainForOrder}
        isOpen={isOrderWizardOpen}
        onClose={() => setIsOrderWizardOpen(false)}
        onOrderComplete={handleOrderComplete}
      />

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
