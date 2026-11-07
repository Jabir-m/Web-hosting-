'use client';
import React from 'react';
import { X, Printer, CheckCircle2, CreditCard } from 'lucide-react';
import { Invoice } from '@/types/hosting';
import { formatNaira } from '@/lib/billing';

interface InvoiceViewModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPayInvoice: (invoice: Invoice) => void;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onPayInvoice,
}) => {
  if (!isOpen || !invoice) return null;

  const isPaid = invoice.status === 'paid';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900 font-mono">{invoice.invoiceNumber}</h3>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                isPaid
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 bg-white text-slate-700 text-xs">
          {/* Header row: Company and Client */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="text-lg font-black text-slate-900 tracking-tight">
                TechBuilders<span className="text-emerald-600">.cloud</span>
              </div>
              <p className="text-slate-500 mt-1">TechBuilders Cloud Ltd (RC 1892041)</p>
              <p className="text-slate-500">Admiralty Way, Lekki Phase 1, Lagos, Nigeria</p>
              <p className="text-slate-500">TIN: 2490182-0001 · VAT Reg: NGR-VAT-8910</p>
            </div>

            <div className="sm:text-right">
              <div className="text-sm font-bold text-slate-900 mb-1">INVOICED TO:</div>
              <p className="text-slate-900 font-semibold">Jabir Mustafa Sulaiman</p>
              <p className="text-slate-500">Apex Digital Solutions Ltd</p>
              <p className="text-slate-500">jabirmustafasulaiman@gmail.com</p>
              <p className="text-slate-500">Lagos, Nigeria</p>
            </div>
          </div>

          {/* Invoice Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
            <div>
              <div className="text-slate-400 text-[10px] font-sans">INVOICE DATE</div>
              <div className="text-slate-900 font-bold">{invoice.dateCreated}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-sans">PAYMENT DUE DATE</div>
              <div className="text-slate-900 font-bold">{invoice.dateDue}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-sans">PAYMENT STATUS</div>
              <div className={isPaid ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                {invoice.status.toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-sans">PAYMENT METHOD</div>
              <div className="text-slate-900 font-sans">{invoice.paymentMethod || 'Paystack / Bank Transfer'}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-4 text-right">Amount (NGN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 text-slate-800 font-sans">{item.description}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{formatNaira(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="max-w-xs space-y-1 text-slate-500 text-[11px]">
              <p className="font-semibold text-slate-700">Payment Instructions:</p>
              <p>Instant settlement through Paystack (cards/USSD) or GTBank/Moniepoint virtual bank accounts.</p>
              {isPaid && invoice.transactionRef && (
                <div className="mt-2 p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-semibold">
                  Ref: {invoice.transactionRef} · Verified via NIBSS
                </div>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <div className="flex justify-between text-slate-600 font-mono">
                <span>Subtotal</span>
                <span>{formatNaira(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-mono">
                <span>7.5% Nigerian VAT</span>
                <span>{formatNaira(invoice.vatAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200 font-mono">
                <span>Total Amount</span>
                <span className="text-emerald-700">{formatNaira(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Close
          </button>

          {!isPaid ? (
            <button
              onClick={() => onPayInvoice(invoice)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay {formatNaira(invoice.total)} Now</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paid in Full</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
