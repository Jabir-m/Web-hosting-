'use client';
import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Invoice } from '@/types/hosting';
import { formatNaira } from '@/lib/billing';

interface PaystackCheckoutModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (invoiceId: string, paymentMethod: string, txRef: string) => void;
}

export const PaystackCheckoutModal: React.FC<PaystackCheckoutModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  if (!isOpen || !invoice) return null;

  const [paymentChannel, setPaymentChannel] = useState<'card' | 'bank' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('5399 4100 8921 4452');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('389');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        const txRef = `PSTK_${Date.now()}_NGA`;
        const methodLabel =
          paymentChannel === 'card'
            ? 'Paystack'
            : paymentChannel === 'bank'
            ? 'Bank Transfer (GTBank)'
            : 'USSD *737#';
        onPaymentSuccess(invoice.id, methodLabel, txRef);
        setIsSuccess(false);
        onClose();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Paystack Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-black text-white text-xs">
              P
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Paystack Checkout</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-[10px] text-slate-500">
                To: <span className="text-slate-800 font-semibold">TechBuilders Cloud Ltd</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary Banner */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Invoice: </span>
            <span className="font-mono text-slate-900 font-semibold">{invoice.invoiceNumber}</span>
          </div>
          <div className="font-mono text-sm font-bold text-emerald-700">
            {formatNaira(invoice.total)}
          </div>
        </div>

        {/* Channels Selector */}
        <div className="p-6 space-y-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Payment Successful!</h4>
              <p className="text-xs text-slate-500">
                Settled through NIBSS. Invoice marked as Paid.
              </p>
            </div>
          ) : (
            <>
              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentChannel('card')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                    paymentChannel === 'card'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChannel('bank')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                    paymentChannel === 'bank'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChannel('ussd')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                    paymentChannel === 'ussd'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>USSD</span>
                </button>
              </div>

              {/* Channel 1: Card form */}
              {paymentChannel === 'card' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Card Number (Verve / Master / Visa)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Channel 2: Bank transfer virtual account */}
              {paymentChannel === 'bank' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="text-slate-600 text-[11px]">
                    Transfer the exact amount to the dedicated virtual NIBSS account below:
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1 shadow-2xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bank:</span>
                      <span className="text-slate-900 font-bold">Guaranty Trust Bank (GTBank)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account Name:</span>
                      <span className="text-slate-900 font-bold">TechBuilders - {invoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Account Number:</span>
                      <span className="font-mono text-sm font-bold text-emerald-700">0129481023</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 text-center">
                    Automatic confirmation within 60 seconds of transfer.
                  </div>
                </div>
              )}

              {/* Channel 3: USSD */}
              {paymentChannel === 'ussd' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-center">
                  <p className="text-slate-600">Dial the code below on your mobile phone:</p>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-sm font-bold text-emerald-700 shadow-2xs">
                    *737*50*{invoice.total}*142#
                  </div>
                  <p className="text-[10px] text-slate-500">Supported on GTBank, Zenith, Access, UBA, Kuda.</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing via Paystack...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatNaira(invoice.total)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
