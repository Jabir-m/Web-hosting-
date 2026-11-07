'use client';
import React, { useState } from 'react';
import { Search, Globe, CheckCircle2, ShoppingCart, ArrowRight } from 'lucide-react';
import { SUPPORTED_TLDS, formatNaira } from '@/lib/billing';

interface DomainCheckerProps {
  onSelectDomainForHosting: (domainName: string) => void;
}

export const DomainChecker: React.FC<DomainCheckerProps> = ({ onSelectDomainForHosting }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedResults, setCheckedResults] = useState<{
    tld: string;
    domain: string;
    price: number;
    available: boolean;
  }[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    // Simulate real-time Whois lookup with Nigerian registrar registry
    setTimeout(() => {
      let baseName = searchTerm.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
      if (baseName.includes('.')) {
        baseName = baseName.split('.')[0];
      }

      const results = SUPPORTED_TLDS.slice(0, 6).map((tldObj, index) => {
        // Deterministic availability for testability:
        // names ending with 'taken' or 'google' are taken, otherwise available
        const isTaken = baseName.includes('taken') || baseName === 'google' || baseName === 'facebook';
        return {
          tld: tldObj.tld,
          domain: `${baseName}${tldObj.tld}`,
          price: tldObj.registrationPrice,
          available: !isTaken || index === 2,
        };
      });

      setCheckedResults(results);
      setIsSearching(false);
    }, 350);
  };

  return (
    <section id="domain-checker" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full mb-3">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>NiRA Certified .ng &amp; Global Domain Registrar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Register or Transfer Your Domain Name
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Instant automated registration with DNS management, free email forwarding, and Whois ID protection.
          </p>
        </div>

        {/* Search input */}
        <div className="max-w-2xl mx-auto bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-md">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. techbuildershub or mybrand"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
            >
              {isSearching ? (
                <span>Checking...</span>
              ) : (
                <>
                  <span>Search Availability</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Box */}
        {checkedResults && (
          <div className="max-w-2xl mx-auto mt-6 bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden divide-y divide-slate-100">
            {checkedResults.map((result) => (
              <div key={result.domain} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2.5">
                  {result.available ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-rose-300 bg-rose-50 text-[10px] text-rose-600 flex items-center justify-center font-bold">
                      ✕
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-sm text-slate-900 font-mono">{result.domain}</span>
                    <div className="text-[11px] text-slate-500">
                      {result.available ? 'Available for instant registration' : 'Already taken by another owner'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 font-mono">{formatNaira(result.price)}</div>
                    <div className="text-[10px] text-slate-500">/ 1st year</div>
                  </div>

                  {result.available ? (
                    <button
                      onClick={() => onSelectDomainForHosting(result.domain)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Hosting</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectDomainForHosting(result.domain)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Transfer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TLD Pricing Cards */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SUPPORTED_TLDS.slice(0, 6).map((item) => (
            <div
              key={item.tld}
              onClick={() => {
                setSearchTerm(searchTerm || 'mywebsite');
                setTimeout(() => {
                  onSelectDomainForHosting(`${searchTerm || 'mywebsite'}${item.tld}`);
                }, 100);
              }}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-white cursor-pointer transition-all text-center group shadow-xs"
            >
              <div className="text-sm font-bold text-slate-900 font-mono group-hover:text-emerald-700 transition-colors">
                {item.tld}
              </div>
              <div className="mt-1 text-xs font-semibold text-emerald-700 font-mono">
                {formatNaira(item.registrationPrice)}
              </div>
              <div className="text-[10px] text-slate-500">per year</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
