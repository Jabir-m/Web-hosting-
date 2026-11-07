'use client';
import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Server, CreditCard } from 'lucide-react';
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

  // Automated Provisioning Simulation
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisionStatusText, setProvisionStatusText] = useState('Initializing server container...');

  const handleExecutePaymentAndProvision = () => {
    setStep(5);
    setProvisionProgress(30);
    setProvisionStatusText('Allocating isolated NVMe disk space on Lagos node...');

    setTimeout(() => {
      setProvisionProgress(65);
      setProvisionStatusText('Configuring cPanel account & Apache/LiteSpeed virtual host...');
    }, 250);

    setTimeout(() => {
      setProvisionProgress(95);
      setProvisionStatusText(`Generating DNS records for ${fullDomain} & issuing SSL...`);
    }, 500);

    setTimeout(() => {
      setProvisionProgress(100);
      setProvisionStatusText('Provisioning complete! Redirecting to billing dashboard...');

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
        sslStatus: 'Active (Let\'s Encrypt)',
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
        transactionRef: `PSTK_${Date.now()}_NGA`,
        items: invoiceItems,
        subtotal: orderSummary.subtotal,
        vatAmount: orderSummary.vatAmount,
        total: orderSummary.grandTotal,
      };

      onOrderComplete(newService, newInvoice);
      onClose();
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Configure &amp; Deploy Web Hosting</h3>
              <p className="text-xs text-slate-500">
                Selected Plan: <strong className="text-emerald-700">{selectedPlan.name}</strong> ({formatNaira(selectedPlan.monthlyPrice)}/mo)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Tracker */}
        {step < 5 && (
          <div className="px-6 py-2.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1.5 font-medium ${step >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
              <span>Domain</span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-slate-200" />
            <div className={`flex items-center gap-1.5 font-medium ${step >= 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
              <span>Billing &amp; Location</span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-slate-200" />
            <div className={`flex items-center gap-1.5 font-medium ${step >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</span>
              <span>Add-ons</span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-slate-200" />
            <div className={`flex items-center gap-1.5 font-medium ${step >= 4 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>4</span>
              <span>Checkout</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Domain Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Step 1: Choose Your Domain Name</h4>
                <p className="text-xs text-slate-500">
                  Every shared hosting package requires a primary domain name to link to your cPanel web root.
                </p>
              </div>

              {/* Action type tabs */}
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
                  <div className="font-semibold">Register New Domain</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Free on annual plan</div>
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
                  <div className="font-semibold">Transfer Existing Domain</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Keep existing registration</div>
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
                  <div className="font-semibold">I already have a domain</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">I will update nameservers</div>
                </button>
              </div>

              {/* Domain Input Field */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Enter Domain Name
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      placeholder="e.g. mynewbrand"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {domainAction === 'register' && (
                    <select
                      value={selectedTld}
                      onChange={(e) => setSelectedTld(e.target.value)}
                      className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600"
                    >
                      {SUPPORTED_TLDS.map((tld) => (
                        <option key={tld.tld} value={tld.tld}>
                          {tld.tld} ({formatNaira(tld.registrationPrice)}/yr)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span>Configured:</span>
                    <span className="font-mono text-emerald-700 font-bold">{fullDomain}</span>
                  </div>
                  {domainValidation.isValid && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ready for hosting
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Billing Cycle & Server Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Step 2: Billing Cycle &amp; Server Location</h4>
                <p className="text-xs text-slate-500">
                  Select your preferred billing period (Monthly, Quarterly with 5% off, Semi-Annually with 10% off, or Annually).
                </p>
              </div>

              {/* Cycle Radios */}
              <div className="space-y-2.5">
                {(Object.keys(BILLING_CYCLES) as BillingCycle[]).map((cycleKey) => {
                  const c = BILLING_CYCLES[cycleKey];
                  const cost = selectedPlan.monthlyPrice * c.months * (1 - c.discountPercent / 100);
                  const isSelected = cycle === cycleKey;

                  return (
                    <label
                      key={cycleKey}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="cycle"
                          checked={isSelected}
                          onChange={() => setCycle(cycleKey)}
                          className="accent-emerald-600"
                        />
                        <div>
                          <div className="text-xs font-semibold flex items-center gap-2">
                            <span>{c.name}</span>
                            {c.badge && (
                              <span className="text-[10px] font-bold text-white bg-emerald-600 px-1.5 py-0.2 rounded">
                                {c.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {c.months} month(s) access at {formatNaira(Math.round(cost / c.months))}/mo
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {formatNaira(Math.round(cost))}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Server Location */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Target Datacenter Node
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { name: 'Lagos Tier III (MDXi Lekki)', ping: '< 12ms Nigeria', flag: '🇳🇬' },
                    { name: 'Johannesburg (Teraco JB1)', ping: '~ 55ms Africa', flag: '🇿🇦' },
                    { name: 'London (Telehouse North)', ping: '~ 98ms Global', flag: '🇬🇧' },
                    { name: 'Frankfurt (Equinix FR5)', ping: '~ 105ms Europe', flag: '🇩🇪' },
                  ].map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => setServerLocation(loc.name)}
                      className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                        serverLocation === loc.name
                          ? 'bg-emerald-50 border-emerald-600 text-slate-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold flex items-center gap-1.5">
                        <span>{loc.flag}</span>
                        <span>{loc.name}</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-mono mt-0.5">{loc.ping}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Add-ons */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Step 3: Optional Server Add-ons</h4>
                <p className="text-xs text-slate-500">
                  Enhance your hosting package with dedicated IPs, enterprise spam filtering, or disaster recovery backups.
                </p>
              </div>

              <div className="space-y-3">
                {AVAILABLE_ADDONS.map((addon) => {
                  const isIncludedInPremium = planId === 'premium' && addon.id === 'dedicated_ip';
                  const isChecked = isIncludedInPremium || selectedAddOns.includes(addon.id);

                  return (
                    <div
                      key={addon.id}
                      onClick={() => !isIncludedInPremium && handleToggleAddon(addon.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-600'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isIncludedInPremium}
                          onChange={() => {}}
                          className="mt-0.5 accent-emerald-600"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>{addon.name}</span>
                            {isIncludedInPremium && (
                              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded font-semibold">
                                Included Free with Premium
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{addon.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-4 font-mono text-xs font-bold text-slate-900">
                        {isIncludedInPremium ? '₦0' : `${formatNaira(addon.monthlyPrice)}/${addon.period}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Payment */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Step 4: Review Order &amp; Direct Naira Checkout</h4>
                <p className="text-xs text-slate-500">
                  Zero foreign exchange fees. Immediate automated provisioning upon payment.
                </p>
              </div>

              {/* Order Breakdown Card */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">
                    {selectedPlan.name} ({BILLING_CYCLES[cycle].name})
                  </span>
                  <span className="font-mono font-bold text-slate-900">{formatNaira(orderSummary.hostingCost)}</span>
                </div>

                {domainAction === 'register' && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Domain: <code className="font-mono text-emerald-700 font-semibold">{fullDomain}</code> (1 Year)</span>
                    <span className="font-mono">
                      {orderSummary.isDomainFree ? (
                        <span className="text-emerald-700 font-semibold">₦0 (FREE)</span>
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

                <div className="flex justify-between items-center text-slate-500 pt-1 border-t border-slate-200">
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

              {/* Promo Code Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Have a promo code? (try NAIJA2026)"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono uppercase focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Payment Gateway Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Select Nigerian Payment Gateway
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Paystack')}
                    className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      paymentMethod === 'Paystack'
                        ? 'bg-emerald-50 border-emerald-600 text-slate-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Paystack</div>
                    <div className="text-[10px] text-slate-500">Cards, USSD, Apple Pay</div>
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
                    <div className="font-bold">Bank Transfer</div>
                    <div className="text-[10px] text-slate-500">GTBank Virtual NIBSS</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Flutterwave')}
                    className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      paymentMethod === 'Flutterwave'
                        ? 'bg-emerald-50 border-emerald-600 text-slate-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Flutterwave</div>
                    <div className="text-[10px] text-slate-500">Barter, Bank &amp; Mobile</div>
                  </button>
                </div>
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
                onClick={handleExecutePaymentAndProvision}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay {formatNaira(orderSummary.grandTotal)} &amp; Deploy</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
