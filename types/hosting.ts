export interface HostingService {
  id: string;
  planId: 'starter' | 'standard' | 'premium';
  planName: string;
  domain: string;
  status: 'active' | 'pending' | 'suspended';
  monthlyPrice: number;
  billingCycle: 'monthly' | 'quarterly' | 'semi-annually' | 'annually' | 'biennially';
  nextDueDate: string;
  serverLocation: string;
  ipAddress: string;
  cpanelUsername: string;
  diskUsedGB: number;
  diskLimitGB: number;
  bandwidthUsedGB: number;
  bandwidthLimitGB: number; // 0 for unlimited
  inodesUsed: number;
  inodesLimit: number;
  phpVersion: string;
  sslStatus: 'Active (Let\'s Encrypt)' | 'Active (PositiveSSL)' | 'Pending';
  autoRenew: boolean;
  dedicatedIp?: boolean;
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  dateCreated: string;
  dateDue: string;
  datePaid?: string;
  status: 'paid' | 'unpaid' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  paymentMethod?: 'Paystack' | 'Flutterwave' | 'Bank Transfer (GTBank)' | 'Wallet Balance';
  transactionRef?: string;
}

export interface RegisteredDomain {
  id: string;
  domainName: string;
  registrationDate: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'transferred';
  autoRenew: boolean;
  whoisPrivacy: boolean;
  nameservers: string[];
  dnsRecords: DnsRecord[];
}

export interface DnsRecord {
  id: string;
  type: 'A' | 'CNAME' | 'MX' | 'TXT' | 'AAAA';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

export interface SupportTicketMessage {
  id: string;
  sender: string;
  senderRole: 'client' | 'support';
  avatar?: string;
  timestamp: string;
  message: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  department: 'Technical Support' | 'Billing & Accounts' | 'Domain Management' | 'Migrations';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'open' | 'answered' | 'customer_reply' | 'closed';
  serviceAffected?: string;
  lastUpdated: string;
  messages: SupportTicketMessage[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  walletBalance: number;
}
