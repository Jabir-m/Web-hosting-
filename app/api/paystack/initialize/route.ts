import { NextResponse } from 'next/server';
import { PAYSTACK_SECRET_KEY } from '@/lib/paystack';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, planName, domain, metadata } = body;

    const amountInKobo = Math.round(Number(amount) * 100);

    const origin = req.headers.get('origin') || 'https://techbuilders.cloud';
    const callbackUrl = `${origin}/?payment=success&service=${encodeURIComponent(planName || 'Hosting')}`;

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || 'customer@client.com',
        amount: amountInKobo,
        currency: 'NGN',
        callback_url: callbackUrl,
        metadata: {
          custom_fields: [
            { display_name: 'Hosting Plan', variable_name: 'plan_name', value: planName || 'Web Hosting' },
            { display_name: 'Domain', variable_name: 'domain', value: domain || 'None' },
            ...(metadata?.custom_fields || []),
          ],
        },
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { status: false, message: err?.message || 'Server error initializing Paystack' },
      { status: 500 }
    );
  }
}
