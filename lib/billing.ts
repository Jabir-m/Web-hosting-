export interface HostingPlan {
  id: 'starter' | 'standard' | 'premium';
  name: string;
  tagline: string;
  monthlyPrice: number; // in Naira (NGN)
  popular?: boolean;
  specs: {
    websites: string;
    storage: string;
    storageType: string;
    bandwidth: string;
    emails: string;
    ram: string;
    cpu: string;
    cpanel: string;
    ssl: string;
    freeDomain: string;
    backups: string;
    webServer: string;
    databases: string;
    subdomains: string;
    dedicatedIp: boolean;
    staging: boolean;
    redisCache: boolean;
  };
}

export type BillingCycle = 'monthly' | 'quarterly' | 'semi-annually' | 'annually';

export interface BillingCycleConfig {
  id: BillingCycle;
  name: string;
  months: number;
  discountPercent: number;
  badge?: string;
  freeDomainEligible: boolean;
}

export const BILLING_CYCLES: Record<BillingCycle, BillingCycleConfig> = {
  'monthly': {
    id: 'monthly',
    name: 'Monthly',
    months: 1,
    discountPercent: 0,
    freeDomainEligible: false,
  },
  'quarterly': {
    id: 'quarterly',
    name: 'Quarterly (3 Mo)',
    months: 3,
    discountPercent: 5,
    badge: 'Save 5%',
    freeDomainEligible: false,
  },
  'semi-annually': {
    id: 'semi-annually',
    name: 'Semi-Annually (6 Mo)',
    months: 6,
    discountPercent: 10,
    badge: 'Save 10%',
    freeDomainEligible: false,
  },
  'annually': {
    id: 'annually',
    name: 'Annually (12 Mo)',
    months: 12,
    discountPercent: 0, // Discount removed as requested
    badge: 'Free Domain',
    freeDomainEligible: true,
  },
};

export const HOSTING_PLANS: HostingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    tagline: 'Ideal for blogs, personal portfolios, and emerging Nigerian startups.',
    monthlyPrice: 7500,
    popular: false,
    specs: {
      websites: '1 Website',
      storage: '20 GB',
      storageType: 'Pure Enterprise NVMe SSD',
      bandwidth: 'Unlimited Bandwidth',
      emails: '5 Business Emails',
      ram: '2 GB Guaranteed RAM',
      cpu: '1 vCPU Core (3.4GHz)',
      cpanel: 'cPanel / DirectAdmin Access',
      ssl: 'Free Let\'s Encrypt SSL',
      freeDomain: 'Standard Rate',
      backups: 'Weekly Auto-Backups',
      webServer: 'LiteSpeed Web Server',
      databases: '5 MySQL Databases',
      subdomains: '5 Subdomains',
      dedicatedIp: false,
      staging: false,
      redisCache: false,
    },
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    tagline: 'Most chosen by Nigerian SMEs, eCommerce stores, and growing businesses.',
    monthlyPrice: 12000,
    popular: true,
    specs: {
      websites: 'Unlimited Websites',
      storage: '60 GB',
      storageType: 'Pure Enterprise NVMe SSD',
      bandwidth: 'Unlimited Unmetered Bandwidth',
      emails: 'Unlimited Business Emails',
      ram: '4 GB Guaranteed RAM',
      cpu: '2 vCPU Cores (3.4GHz)',
      cpanel: 'cPanel + WP Toolkit Deluxe',
      ssl: 'Free AutoSSL on all domains',
      freeDomain: 'Free .com.ng (Annual)',
      backups: 'Daily Automated JetBackups',
      webServer: 'LiteSpeed Enterprise + LSCache',
      databases: 'Unlimited MySQL Databases',
      subdomains: 'Unlimited Subdomains',
      dedicatedIp: false,
      staging: true,
      redisCache: true,
    },
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    tagline: 'Maximum power, speed, and dedicated resources for high-traffic platforms.',
    monthlyPrice: 15000,
    popular: false,
    specs: {
      websites: 'Unlimited Websites',
      storage: '150 GB',
      storageType: 'Pure Enterprise NVMe SSD',
      bandwidth: 'Unlimited High-Priority Bandwidth',
      emails: 'Unlimited Business Emails',
      ram: '8 GB Dedicated RAM',
      cpu: '4 vCPU Cores (3.8GHz)',
      cpanel: 'cPanel + WHM Ready Tools',
      ssl: 'Free Wildcard SSL',
      freeDomain: 'Free .ng or .com.ng (Annual)',
      backups: 'Real-time Continuous Backups (30-day retention)',
      webServer: 'LiteSpeed Enterprise + Redis Object Cache',
      databases: 'Unlimited MySQL Databases',
      subdomains: 'Unlimited Subdomains',
      dedicatedIp: true,
      staging: true,
      redisCache: true,
    },
  },
];

export interface DomainTld {
  tld: string;
  registrationPrice: number; // yearly price in NGN
  renewalPrice: number;
  featured?: boolean;
  popularInNigeria?: boolean;
}

export const SUPPORTED_TLDS: DomainTld[] = [
  { tld: '.com.ng', registrationPrice: 3500, renewalPrice: 3500, featured: true, popularInNigeria: true },
  { tld: '.org.ng', registrationPrice: 20000, renewalPrice: 20000, featured: true, popularInNigeria: true },
  { tld: '.com', registrationPrice: 30000, renewalPrice: 30000, featured: true, popularInNigeria: false },
  { tld: '.ng', registrationPrice: 11500, renewalPrice: 11500, featured: true, popularInNigeria: true },
  { tld: '.org', registrationPrice: 21000, renewalPrice: 21000, featured: false, popularInNigeria: false },
  { tld: '.africa', registrationPrice: 14000, renewalPrice: 14000, featured: true, popularInNigeria: true },
  { tld: '.net', registrationPrice: 19500, renewalPrice: 19500, featured: false, popularInNigeria: false },
  { tld: '.edu.ng', registrationPrice: 2500, renewalPrice: 2500, featured: false, popularInNigeria: true },
];

export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  period: 'month' | 'year';
}

export const AVAILABLE_ADDONS: AddOnItem[] = [
  {
    id: 'dedicated_ip',
    name: 'Dedicated IPv4 Address',
    description: 'Clean dedicated IP in Lagos data center for optimal email deliverability and SSL security.',
    monthlyPrice: 3500,
    period: 'month',
  },
  {
    id: 'spamexperts',
    name: 'SpamExperts Inbound & Outbound Filter',
    description: '99.98% spam protection and phishing defence for your company email mailboxes.',
    monthlyPrice: 1500,
    period: 'month',
  },
  {
    id: 'jetbackup_cloud',
    name: 'Offsite Cloud Backup Vault (50GB)',
    description: 'Disaster recovery automated snapshots stored in an isolated external data center.',
    monthlyPrice: 2000,
    period: 'month',
  },
  {
    id: 'sectigo_ssl',
    name: 'Sectigo PositiveSSL Wildcard',
    description: 'Commercial organization validation trust seal with $10,000 warranty.',
    monthlyPrice: 8500,
    period: 'year',
  },
];

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateHostingCost(
  planId: 'starter' | 'standard' | 'premium',
  cycle: BillingCycle
): {
  baseMonthly: number;
  totalBeforeDiscount: number;
  discountAmount: number;
  finalTotal: number;
  effectiveMonthly: number;
} {
  const plan = HOSTING_PLANS.find((p) => p.id === planId) || HOSTING_PLANS[0];
  const cycleConfig = BILLING_CYCLES[cycle];

  const totalBeforeDiscount = plan.monthlyPrice * cycleConfig.months;
  const discountAmount = Math.round(totalBeforeDiscount * (cycleConfig.discountPercent / 100));
  const finalTotal = totalBeforeDiscount - discountAmount;
  const effectiveMonthly = Math.round(finalTotal / cycleConfig.months);

  return {
    baseMonthly: plan.monthlyPrice,
    totalBeforeDiscount,
    discountAmount,
    finalTotal,
    effectiveMonthly,
  };
}

export interface OrderCalculationInput {
  planId: 'starter' | 'standard' | 'premium';
  cycle: BillingCycle;
  domainName?: string;
  domainAction?: 'register' | 'transfer' | 'own';
  selectedAddOns?: string[];
  promoCode?: string;
}

export interface OrderCalculationResult {
  hostingCost: number;
  hostingDiscount: number;
  domainCost: number;
  isDomainFree: boolean;
  addOnsCost: number;
  subtotal: number;
  vatAmount: number; // 7.5% Nigerian VAT
  promoDiscount: number;
  grandTotal: number;
}

export function calculateOrderTotal(input: OrderCalculationInput): OrderCalculationResult {
  const { planId, cycle, domainName = '', domainAction = 'own', selectedAddOns = [], promoCode = '' } = input;
  
  const hosting = calculateHostingCost(planId, cycle);
  const cycleConfig = BILLING_CYCLES[cycle];

  // Calculate domain cost
  let domainCost = 0;
  let isDomainFree = false;

  if (domainAction === 'register' && domainName) {
    const matchedTld = SUPPORTED_TLDS.find((t) => domainName.toLowerCase().endsWith(t.tld));
    const baseDomainPrice = matchedTld ? matchedTld.registrationPrice : 3500;

    // Check free domain qualification:
    // Standard plan on annual+ gets .com.ng free
    // Premium plan on annual+ gets .com.ng OR .ng free
    if (cycleConfig.freeDomainEligible) {
      if (planId === 'premium' && (domainName.endsWith('.ng') || domainName.endsWith('.com.ng'))) {
        isDomainFree = true;
        domainCost = 0;
      } else if (planId === 'standard' && domainName.endsWith('.com.ng')) {
        isDomainFree = true;
        domainCost = 0;
      } else {
        domainCost = baseDomainPrice;
      }
    } else {
      domainCost = baseDomainPrice;
    }
  }

  // Calculate add-ons cost
  let addOnsCost = 0;
  selectedAddOns.forEach((addonId) => {
    // If premium plan and addon is dedicated_ip, it's free
    if (planId === 'premium' && addonId === 'dedicated_ip') {
      return;
    }
    const addon = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    if (addon) {
      if (addon.period === 'month') {
        addOnsCost += addon.monthlyPrice * cycleConfig.months;
      } else {
        // yearly add-on
        const years = Math.max(1, Math.round(cycleConfig.months / 12));
        addOnsCost += addon.monthlyPrice * years;
      }
    }
  });

  const subtotal = hosting.finalTotal + domainCost + addOnsCost;

  // Promo code discounts
  let promoDiscount = 0;
  if (promoCode.trim().toUpperCase() === 'NAIJA2026') {
    promoDiscount = Math.round(subtotal * 0.1); // 10% off
  } else if (promoCode.trim().toUpperCase() === 'HOSTAFRICA5000') {
    promoDiscount = Math.min(subtotal, 5000); // ₦5,000 instant credit
  }

  const discountedSubtotal = Math.max(0, subtotal - promoDiscount);

  // Nigerian statutory VAT (7.5%)
  const vatAmount = Math.round(discountedSubtotal * 0.075);
  const grandTotal = discountedSubtotal + vatAmount;

  return {
    hostingCost: hosting.finalTotal,
    hostingDiscount: hosting.discountAmount,
    domainCost,
    isDomainFree,
    addOnsCost,
    subtotal,
    vatAmount,
    promoDiscount,
    grandTotal,
  };
}

export function validateDomainInput(domain: string): { isValid: boolean; normalized: string; error?: string } {
  const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
  if (!clean) {
    return { isValid: false, normalized: '', error: 'Domain name cannot be empty.' };
  }
  const hasValidTld = SUPPORTED_TLDS.some((t) => clean.endsWith(t.tld));
  if (!hasValidTld && !clean.includes('.')) {
    // Default to .com.ng if no TLD typed
    return { isValid: true, normalized: `${clean}.com.ng` };
  }
  if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9](\.[a-z]{2,})+$/.test(clean)) {
    return { isValid: false, normalized: clean, error: 'Please enter a valid domain name (alphanumeric and hyphens only).' };
  }
  return { isValid: true, normalized: clean };
}
