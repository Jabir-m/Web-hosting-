export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_d29362f1048547f4bc49e7082922d8143c8f8ec5';

export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export const COMPANY_PHONE = '0807 986 8108';
export const COMPANY_PHONE_RAW = '08079868108';
export const COMPANY_PHONE_INTL = '+2348079868108';
export const WHATSAPP_LINK = 'https://wa.me/2348079868108?text=Hello%20TechBuilders%20Cloud,%20I%20want%20to%20order%20web%20hosting';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref?: string;
        metadata?: Record<string, any>;
        callback?: (response: { reference: string; status: string; trans: string }) => void;
        onClose?: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

/**
 * Loads Paystack inline.js if not already present on window.
 */
export function loadPaystackScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.PaystackPop) {
      resolve(true);
      return;
    }
    const existing = document.getElementById('paystack-inline-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-inline-js';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
