import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechBuilders Cloud — Nigerian Web Hosting in Naira (₦)",
  description:
    "Nigeria's fastest Tier III cloud hosting. NVMe SSD shared hosting, cPanel, free SSL. Pay in Naira via Paystack. Starter ₦7,500/mo, Standard ₦12,000/mo, Premium ₦15,000/mo.",
  keywords:
    "web hosting nigeria, naira hosting, cpanel hosting, nigerian web host, lagos hosting, nvme hosting nigeria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
