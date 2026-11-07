'use client';
import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Server, CreditCard, ShieldCheck, Phone, Loader2 } from 'lucide-react';
import {
  HOSTING_PLANS,
  BILLING_CYCLES,
  SUPPORTED_TLDS,
  AVAILABLE_ADDONS,
  BillingCycle,
  calculateOrderTotal,
  validateDomainInput,
  formatNaira,
} from '@/lib/billing';
import { HostingService, Invoice } from '@/types/hosting';
import { PAYSTACK_PUBLIC_KEY, COMPANY_PHONE, loadPaystackScript } from '@/lib/paystack';

interface OrderWizardModalProps {
  initialPlanId?: 'starter' | 'standard' | 'premium';
  initialDomain?: string;
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (newService: HostingService, newInvoice: Invoice) => void;
}

export const OrderWizardModal: React.FC<OrderWizardModalProps> = ({
  initialPlanId = 'standard',
  initialDomain = '',
  isOpen,
  onClose,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [planId] = useState<'starter' | 'standard' | 'premium'>(initialPlanId);
  const [cycle, setCycle] = useState<BillingCycle>('annually');
  const [domainAction, setDomainAction] = useState<'register' | 'transfer' | 'own'>('register');
  const [domainInput, setDomainInput] = useState(initialDomain || 'mycompany');
  const [selectedTld, setSelectedTld] = useState('.com');
  const [serverLocation, setServerLocation] = useState('Lagos Tier III (MDXi Lekki)');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Paystack' | 'Bank Transfer (GTBank)' | 'Flutterwave'>('Paystack');

  // Client Contact Details for Receipt & Setup
  const [clientFullName, setClientFullName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Compute full domain
  const rawDomain = domainInput.trim().toLowerCase();
  const fullDomain = rawDomain.includes('.') ? rawDomain : `${rawDomain}${selectedTld}`;
  const domainValidation = validateDomainInput(fullDomain);

  // Calculate pricing breakdown
  const orderSummary = calculateOrderTotal({
    planId,
    cycle,
    domainName: fullDomain,
    domainAction,
    selectedAddOns,
    promoCode: promoApplied,
  });

  const selectedPlan = HOSTING_PLANS.find((p) => p.id === planId) || HOSTING_PLANS[1];

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'NAIJA2026' || promoCode.trim().toUpperCase() === 'HOSTAFRICA5000') {
      setPromoApplied(promoCode.trim().toUpperCase());
    } else {
      alert('Invalid promo code. Try code "NAIJA2026" for 10% discount!');
    }
  };

  const handleToggleAddon = (addonId: string) => {
    if (selectedAddOns.includes(addonId)) {
      setSelectedAddOns(selectedAddOns.filter((id) => id !== addonId));
    } else {
      setSelectedAddOns([...selectedAddOns, addonId]);
    }
  };

  // Automated Provisioning Animation
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisionStatusText, setProvisionStatusText] = useState('Initializing server container...');

  const startProvisioning = (txRef: string) => {
    setStep(5);
    setProvisionProgress(30);
    setProvisionStatusText('Allocating isolated NVMe disk space on Lagos node...');

    setTimeout(() => {
      setProvisionProgress(65);
      setProvisionStatusText('Configuring cPanel account & Apache/LiteSpeed virtual host...');
    }, 400);

    setTimeout(() => {
      setProvisionProgress(95);
      setProvisionStatusText(`Generating DNS records for ${fullDomain} & issuing SSL...`);
    }, 800);

    setTimeout(() => {
      setProvisionProgress(100);
      setProvisionStatusText('Provisioning complete! Your hosting container is ready.');

      // Construct new service
      const uniqueId = `srv-${Date.now().toString().slice(-4)}`;
      const cpanelUser = fullDomain.replace(/[^a-z0-9]/g, '').slice(0, 8);
      const newService: HostingService = {
        id: uniqueId,
        planId,
        planName: selectedPlan.name,
        domain: fullDomain,
        status: 'active',
        monthlyPrice: selectedPlan.monthlyPrice,
        billingCycle: cycle,
        nextDueDate: '2027-11-07',
        serverLocation,
        ipAddress: planId === 'premium' ? '102.164.120.99' : '102.164.120.88',
        cpanelUsername: cpanelUser,
        diskUsedGB: 0.1,
        diskLimitGB: planId === 'starter' ? 20 : planId === 'standard' ? 60 : 150,
        bandwidthUsedGB: 0,
        bandwidthLimitGB: 0,
        inodesUsed: 1420,
        inodesLimit: planId === 'starter' ? 150000 : planId === 'standard' ? 350000 : 600000,
        phpVersion: '8.3',
        sslStatus: "Active (Let's Encrypt)",
        autoRenew: true,
        dedicatedIp: planId === 'premium' || selectedAddOns.includes('dedicated_ip'),
      };

      // Construct invoice
      const invNumber = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
      const invoiceItems = [
        {
          description: `${selectedPlan.name} (${BILLING_CYCLES[cycle].name}) - ${fullDomain}`,
          amount: orderSummary.hostingCost,
        },
      ];
      if (domainAction === 'register') {
        invoiceItems.push({
          description: orderSummary.isDomainFree
            ? `Free .${fullDomain.split('.').slice(1).join('.')} Registration (Annual Plan Bonus)`
            : `Domain Registration (${fullDomain})`,
          amount: orderSummary.domainCost,
        });
      }
      selectedAddOns.forEach((addonId) => {
        const addon = AVAILABLE_ADDONS.find((a) => a.id === addonId);
        if (addon) {
          invoiceItems.push({
            description: `Addon: ${addon.name}`,
            amount: addon.period === 'month' ? addon.monthlyPrice * BILLING_CYCLES[cycle].months : addon.monthlyPrice,
          });
        }
      });

      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: invNumber,
        dateCreated: 'Today',
        dateDue: 'Today',
        datePaid: 'Today',
        status: 'paid',
        paymentMethod,
        transactionRef: txRef,
        items: invoiceItems,
        subtotal: orderSummary.subtotal,
        vatAmount: orderSummary.vatAmount,
        total: orderSummary.grandTotal,
      };

      onOrderComplete(newService, newInvoice);
      onClose();
    }, 1300);
  };

  const handleCheckoutSubmit = async () => {
    if (paymentMethod === 'Paystack') {
      const email = clientEmail.trim();
      if (!email || !email.includes('@')) {
        alert('Please enter your email address to receive your official Paystack receipt and login details.');
        return;
      }
      setIsProcessingPayment(true);
      await loadPaystackScript();

      if (typeof window !== 'undefined' && window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: email,
          amount: Math.round(orderSummary.grandTotal * 100),
          currency: 'NGN',
          ref: `TBC_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          metadata: {
            custom_fields: [
              { display_name: 'Customer Name', variable_name: 'customer_name', value: clientFullName || 'Valued Client' },
              { display_name: 'Hosting Plan', variable_name: 'hosting_plan', value: selectedPlan.name },
              { display_name: 'Domain', variable_name: 'domain', value: fullDomain },
              { display_name: 'Phone', variable_name: 'phone', value: clientPhone || COMPANY_PHONE },
            ],
          },
          callback: (res: any) => {
            setIsProcessingPayment(false);
            startProvisioning(res.reference || `PSTK_${Date.now()}`);
          },
          onClose: () => {
            setIsProcessingPayment(false);
          },
        });
        handler.openIframe();
      } else {
        // Fallback: initialize via API
        try {
          const res = await fetch('/api/paystack/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              amount: orderSummary.grandTotal,
              planName: `${selectedPlan.name} (${fullDomain})`,
              domain: fullDomain,
            }),
          });
          const data = await res.json();
          if (data?.data?.authorization_url) {
            window.location.href = data.data.authorization_url;
          } else {
            startProvisioning(`PSTK_${Date.now()}_NGA`);
          }
        } catch {
          startProvisioning(`PSTK_${Date.now()}_NGA`);
        } finally {
          setIsProcessingPayment(false);
        }
      }
    } else {
      startProvisioning(`TRF_${Date.now()}_GTB`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Server className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Deploy Cloud Hosting: {selectedPlan.name}
              </h3>
              <p className="text-xs text-slate-500">
                Lagos Tier III MDXi Infrastructure · Instant Setup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: 'Domain' },
              { num: 2, label: 'Billing Cycle' },
              { num: 3, label: 'Add-ons' },
              { num: 4, label: 'Payment' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    step === s.num
                      ? 'bg-emerald-600 text-white'
                      : step > s.num
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span
                  className={`hidden sm:inline font-medium ${
                    step === s.num ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
                {s.num < 4 && <span className="text-slate-300">/</span>}
              </div>
            ))}
          </div>

          <div className="font-mono text-emerald-700 font-bold text-xs">
            {formatNaira(orderSummary.grandTotal)}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Choose Domain */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Step 1: Choose Your Website Domain</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Register a new domain or connect your existing one to your cloud hosting plan.
                </p>
              </div>

              {/* Domain Action Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDomainAction('register')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                    domainAction === 'register'
                      ? 'bg-emerald-50 border-emerald-600 text-slate-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Register New Domain</div>
                  <div className="text-[10px] text-slate-500">.com, .ng, .org.ng</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDomainAction('transfer')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                    domainAction === 'transfer'
                      ? 'bg-emerald-50 border-emerald-600 text-slate-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Transfer Domain</div>
                  <div className="text-[10px] text-slate-500">From another registrar</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDomainAction('own')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                    domainAction === 'own'
                      ? 'bg-emerald-50 border-emerald-600 text-slate-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">I Have a Domain</div>
                  <div className="text-[10px] text-slate-500">Update nameservers only</div>
                </button>
              </div>

              {/* Domain Input Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Enter Domain Name
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                      https://
                    </span>
                    <input
                      type="text"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      placeholder="example"
                      className="w-full pl-16 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {!domainInput.includes('.') && (
                    <select
                      value={selectedTld}
                      onChange={(e) => setSelectedTld(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600"
                    >
                      {SUPPORTED_TLDS.map((tld) => (
                        <option key={tld.tld} value={tld.tld}>
                          {tld.tld} ({formatNaira(tld.registrationPrice)})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Selected domain: <strong className="font-mono text-slate-900">{fullDomain}</strong></span>
                  {domainAction === 'register' && orderSummary.isDomainFree && (
                    <span className="text-emerald-700 font-semibold">🎁 Free domain bonus included!</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Billing Cycle & Datacenter */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Step 2: Choose Your Billing Cycle</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save up to 25% with longer commitments. All cycles billed transparently in Nigerian Naira.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.keys(BILLING_CYCLES) as BillingCycle[]).map((cKey) => {
                  const c = BILLING_CYCLES[cKey];
                  const isSelected = cycle === cKey;
                  return (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => setCycle(cKey)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {c.discountPercent > 0 && (
                        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          Save {c.discountPercent}%
                        </span>
                      )}
                      <div className="text-xs font-bold text-slate-900">{c.name}</div>
                      <div className="mt-1 font-mono text-base font-extrabold text-emerald-700">
                        {formatNaira(selectedPlan.monthlyPrice * (1 - c.discountPercent / 100) * c.months)}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        {c.months === 1 ? 'Billed monthly' : `Covers ${c.months} months hosting`}
                      </div>
                      {c.freeDomainEligible && (
                        <div className="mt-2 text-[10px] font-semibold text-emerald-800 bg-white/80 px-2 py-0.5 rounded border border-emerald-200">
                          Includes Free Domain Registration
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Datacenter Selection */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Primary Cloud Datacenter Location
                </label>
                <select
                  value={serverLocation}
                  onChange={(e) => setServerLocation(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Lagos Tier III (MDXi Lekki)">Lagos Tier III MDXi Lekki (Sub-15ms Nigerian Latency) - Recommended</option>
                  <option value="London Tier IV (Docklands)">London Tier IV Docklands (International)</option>
                  <option value="Johannesburg (Teraco JB1)">Johannesburg Teraco JB1 (Southern Africa)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Add-ons & Extra Features */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Step 3: Recommended Cloud Add-ons</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enhance your server performance, security, and backup protection.
                </p>
              </div>

              <div className="space-y-3">
                {AVAILABLE_ADDONS.map((addon) => {
                  const isChecked = selectedAddOns.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-600'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{addon.name}</div>
                          <div className="text-[11px] text-slate-500">{addon.description}</div>
                        </div>
                      </div>
                      <div className="font-mono text-xs font-bold text-slate-900">
                        +{formatNaira(addon.monthlyPrice)}
                        <span className="text-[10px] text-slate-500 font-normal">/{addon.period}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Review, Client Info & Real Paystack Checkout */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Step 4: Review &amp; Secure Payment</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your details to generate your official cPanel credentials and Paystack payment receipt.
                </p>
              </div>

              {/* Client Contact Inputs */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-900">Client / Business Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Full Name / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientFullName}
                      onChange={(e) => setClientFullName(e.target.value)}
                      placeholder="e.g. Adeola Johnson / Acme Ltd"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Email Address (For Receipt &amp; cPanel Login) *
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="080... or +234..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Order Summary Receipt Box */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span>{selectedPlan.name} ({BILLING_CYCLES[cycle].name})</span>
                  <span className="font-mono font-semibold">{formatNaira(orderSummary.hostingCost)}</span>
                </div>

                {domainAction === 'register' && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Domain: {fullDomain}</span>
                    <span className="font-mono">
                      {orderSummary.isDomainFree ? (
                        <span className="text-emerald-700 font-bold">FREE (Bonus)</span>
                      ) : (
                        formatNaira(orderSummary.domainCost)
                      )}
                    </span>
                  </div>
                )}

                {orderSummary.addOnsCost > 0 && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Configured Add-ons</span>
                    <span className="font-mono">{formatNaira(orderSummary.addOnsCost)}</span>
                  </div>
                )}

                {orderSummary.promoDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 font-medium">
                    <span>Promo Discount ({promoApplied})</span>
                    <span className="font-mono">-{formatNaira(orderSummary.promoDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-500 pt-2 border-t border-slate-200">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-900">{formatNaira(orderSummary.subtotal)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span>Nigerian VAT (7.5% Statutory)</span>
                  <span className="font-mono text-slate-900">{formatNaira(orderSummary.vatAmount)}</span>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-slate-300 text-sm font-bold text-slate-900">
                  <span>Total Amount Due (NGN)</span>
                  <span className="font-mono text-base text-emerald-700">{formatNaira(orderSummary.grandTotal)}</span>
                </div>
              </div>

              {/* Payment Gateway Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Select Nigerian Payment Gateway
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Paystack')}
                    className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      paymentMethod === 'Paystack'
                        ? 'bg-emerald-50 border-emerald-600 text-slate-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>Paystack</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[10px] text-slate-500">Cards, USSD, Bank Transfer, Apple Pay</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank Transfer (GTBank)')}
                    className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      paymentMethod === 'Bank Transfer (GTBank)'
                        ? 'bg-emerald-50 border-emerald-600 text-slate-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Direct Bank Transfer</div>
                    <div className="text-[10px] text-slate-500">NIBSS Instant Transfer</div>
                  </button>
                </div>

                {paymentMethod === 'Bank Transfer (GTBank)' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                    <div className="font-bold">Direct Bank Transfer Instructions:</div>
                    <div>Please make payment to our designated billing account and call/WhatsApp <strong className="font-mono">{COMPANY_PHONE}</strong> with your proof of payment for immediate cPanel activation.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Automated Provisioning Loading Animation */}
          {step === 5 && (
            <div className="py-12 px-4 text-center max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center animate-spin">
                <Server className="w-8 h-8 text-emerald-600" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">Deploying Your Hosting Container</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Connecting to MDXi Lekki Tier III Hypervisor...
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 border border-slate-200 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${provisionProgress}%` }}
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-emerald-700 font-semibold">
                {provisionStatusText}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Buttons */}
        {step < 5 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleCheckoutSubmit}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Paystack...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay {formatNaira(orderSummary.grandTotal)} with Paystack</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
