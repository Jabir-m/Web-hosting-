'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How do I pay in Nigerian Naira (₦)? Are dollar cards required?',
    a: 'No international dollar cards or virtual dollar cards are required! We accept all Nigerian payment methods directly via Paystack and Flutterwave, including Verve, Naira Mastercard, Visa, USSD banking codes (*737#, *966#, etc.), and instant Bank Transfer to our dedicated NIBSS virtual bank account with immediate automated order activation.',
  },
  {
    q: 'What is the difference between Starter (₦7,500), Standard (₦12,000), and Premium (₦15,000)?',
    a: 'Starter (₦7,500/mo) is tailored for 1 website with 20GB NVMe storage and 5 business emails. Standard (₦12,000/mo) supports Unlimited websites, 60GB NVMe storage, 4GB RAM, daily automated backups, and includes a free .com.ng domain on annual plans. Premium (₦15,000/mo) delivers 150GB NVMe storage, 8GB RAM, 4 CPU cores, and includes a Dedicated IPv4 Address and free .ng or .com.ng domain.',
  },
  {
    q: 'Can you migrate my existing website from Namecheap, GoDaddy, or Whogohost?',
    a: 'Yes, 100% free of charge! Once you order your hosting package, submit a quick migration ticket with your old cPanel backup or login credentials. Our Lagos technical migration team will transfer your files, MySQL databases, and emails with zero downtime.',
  },
  {
    q: 'What are TechBuilders Cloud\'s default nameservers for domain pointing?',
    a: 'Our primary low-latency nameservers are ns1.techbuilders.cloud and ns2.techbuilders.cloud (with backup ns3.techbuilders.cloud in South Africa). If you already own your domain at another registrar, simply update the nameservers to these values.',
  },
  {
    q: 'Is cPanel control panel provided?',
    a: 'Yes! All shared hosting accounts come with full standard cPanel access, phpMyAdmin, Softaculous 1-click script installer, File Manager, Email accounts management, and PHP version selector (PHP 7.4 through 8.3).',
  },
];

const TESTIMONIALS = [
  {
    name: 'Chinedu Eze',
    role: 'Lead Engineer at PayBridge Africa',
    city: 'Lekki, Lagos',
    content: 'We migrated our merchant portal from an overseas host to TechBuilders Cloud Standard Plan. Page latency dropped from 220ms to 12ms for our Nigerian customers. Paying in Naira without fluctuating FX rates gives our team total financial predictability.',
  },
  {
    name: 'Funke Adebayo',
    role: 'Founder & CEO, Zari Luxury Fashion',
    city: 'Abuja, FCT',
    content: 'Our WooCommerce store used to crash during Black Friday sales. Switching to the LiteSpeed NVMe servers on the ₦12,000/mo Standard plan kept our site responsive under heavy traffic. The automated daily backups give me peace of mind.',
  },
  {
    name: 'Tariere Briggs',
    role: 'Agency Director, Apex Byte Studios',
    city: 'Port Harcourt',
    content: 'We host over 24 client websites on the Premium Plan with the dedicated IP. cPanel staging and 1-click WordPress clone tools have doubled our agency deployment speed. Customer support on WhatsApp is genuinely rapid.',
  },
];

export const TestimonialsFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Trusted by Over 10,000+ Nigerian Businesses
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Real feedback from developers, e-commerce stores, and digital agencies across Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    "{t.content}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.role}</p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-emerald-700">{t.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Everything You Need to Know About Our Hosting
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-white border border-slate-200 overflow-hidden transition-colors shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                    <span className="text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
