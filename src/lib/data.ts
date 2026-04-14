export type Priority = 'high' | 'normal';
export type Status = 'open' | 'closed';
export type Category = 'Order' | 'Refund' | 'Shipping Issue' | 'General' | 'Order Cancellation';
export type AiConfidenceLabel = 'Likely Trustworthy' | 'Moderate Risk' | 'High Risk';

export interface Message {
  id: string;
  sender: 'customer' | 'agent';
  senderName: string;
  content: string;
  timestamp: string;
}

export interface AiSignal {
  type: 'positive' | 'negative';
  heading: string;
  detail: string;
}

export interface OrderHistoryItem {
  orderId: string;
  product: string;
  amount: string;
  date: string;
  status: string;
}

export interface TicketHistoryItem {
  ticketId: string;
  subject: string;
  date: string;
  status: 'resolved' | 'closed' | 'open';
}

export interface LineItem {
  name: string;
  qty: number;
  price: string;
}

export interface Ticket {
  id: string;
  customer: {
    name: string;
    email: string;
    initials: string;
    avatarColor: string;
    since: string;
  };
  subject: string;
  preview: string;
  category: Category;
  priority: Priority;
  status: Status;
  assignee: string;
  assigneeInitials: string;
  timestamp: string;
  messages: Message[];
  ticketSummary: string;
  aiConfidence: number;
  aiConfidenceLabel: AiConfidenceLabel;
  aiSignals: AiSignal[];
  quickActions: string[];
  orderDetails?: {
    orderId: string;
    orderNumber: string;
    amount: string;
    date: string;
    status: string;
    lineItems: LineItem[];
  };
  orderHistory: OrderHistoryItem[];
  ticketHistory: TicketHistoryItem[];
}

export const tickets: Ticket[] = [
  {
    id: '#5195',
    customer: {
      name: 'James Wright',
      email: 'james.wright@email.com',
      initials: 'JW',
      avatarColor: '#475569',
      since: 'Mar 2021',
    },
    subject: 'Wrong item shipped',
    preview: 'I received the wrong item in my order. I ordered a blue hoodie in size M but received a red t-shirt in size L. Order #ORD-2024-5195. I need this resolved urgently as I have an event on Thursday and the correct item must arrive before then.',
    category: 'Order',
    priority: 'high',
    status: 'open',
    assignee: 'Unassigned',
    assigneeInitials: 'UA',
    timestamp: '2m ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'James Wright',
        content:
          "Hi, I received the wrong item in my order. I ordered a blue hoodie in size M but received a red t-shirt in size L. Order #ORD-2024-5195. Can you help me get the right item?",
        timestamp: '10:23 AM',
      },
      {
        id: '2',
        sender: 'agent',
        senderName: 'Evo AI',
        content:
          "Hi James, I'm so sorry about that mix-up! I can see your order #ORD-2024-5195 was indeed for a blue hoodie in size M. This shouldn't have happened.\n\nI have a few options for you:\n• Store Credit — We'll issue full store credit immediately\n• Full Refund — We'll refund the original payment\n• Replace Product — We'll ship the correct item with express delivery",
        timestamp: '10:25 AM',
      },
      {
        id: '3',
        sender: 'customer',
        senderName: 'James Wright',
        content:
          "I'd like the correct item shipped please. I need it by Thursday for an event.",
        timestamp: '10:31 AM',
      },
    ],
    ticketSummary:
      'Customer received wrong item — red t-shirt (L) instead of blue hoodie (M) from order #ORD-2024-5195. Requesting product replacement with express delivery needed by Thursday.',
    aiConfidence: 75,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      {
        type: 'positive',
        heading: 'Long-standing account in good standing',
        detail: 'Customer since Mar 2021 — no prior fraud flags or chargebacks',
      },
      {
        type: 'positive',
        heading: 'Low refund request rate',
        detail: 'Only 1 refund in 38 orders (2.6%) — well below the 8% risk threshold',
      },
      {
        type: 'positive',
        heading: 'Item returned before refund claimed',
        detail: 'Tracking confirms warehouse receipt 2 days before this ticket was opened',
      },
      {
        type: 'negative',
        heading: 'Refund requested within 24 h of delivery',
        detail: 'Unusually fast turnaround — may warrant a brief agent review',
      },
    ],
    quickActions: ['Replace Product', 'Full Refund ($89.99)', 'Store Credit ($89.99)'],
    orderDetails: {
      orderId: 'ORD-2024-5195',
      orderNumber: '5195-A',
      amount: '$89.99',
      date: 'Apr 10, 2026',
      status: 'Delivered',
      lineItems: [
        { name: 'Blue Hoodie — Size M', qty: 1, price: '$89.99' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5195', product: 'Blue Hoodie — Size M', amount: '$89.99', date: 'Apr 10, 2026', status: 'Delivered' },
      { orderId: 'ORD-2024-4821', product: 'Wool Scarf — Grey', amount: '$34.00', date: 'Jan 5, 2026', status: 'Delivered' },
      { orderId: 'ORD-2024-4201', product: 'Slim Fit Jeans — 32', amount: '$64.99', date: 'Oct 12, 2025', status: 'Delivered' },
    ],
    ticketHistory: [
      { ticketId: '#4203', subject: 'Item arrived late', date: 'Oct 15, 2025', status: 'resolved' },
      { ticketId: '#3891', subject: 'Discount not applied', date: 'Jul 3, 2025', status: 'resolved' },
    ],
  },
  {
    id: '#5194',
    customer: {
      name: 'Sarah Customer',
      email: 'sarah.c@email.com',
      initials: 'SC',
      avatarColor: '#7c3aed',
      since: 'Jan 2023',
    },
    subject: 'Refund not received after 7 days',
    preview: "I requested a refund last week for order #ORD-2024-5180 but I still haven't received it after 7 days. My bank shows nothing and I've followed up three times already. The refund was supposed to arrive by Apr 14th but it's now overdue.",
    category: 'Refund',
    priority: 'high',
    status: 'open',
    assignee: 'Alex M.',
    assigneeInitials: 'AM',
    timestamp: '15m ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Sarah Customer',
        content:
          "I requested a refund last week for order #ORD-2024-5180 but I still haven't received it. It's been 7 days and my bank shows nothing. This is really frustrating.",
        timestamp: '9:45 AM',
      },
      {
        id: '2',
        sender: 'agent',
        senderName: 'Evo AI',
        content:
          "Hi Sarah, I sincerely apologize for the delay. I can see the refund was initiated on Apr 7th. Bank transfers typically take 5–7 business days. You should see it by Apr 14th. If you don't see it by then, please reach out and we'll escalate immediately.",
        timestamp: '9:50 AM',
      },
    ],
    ticketSummary:
      'Customer requesting status update on refund for order #ORD-2024-5180 initiated 7 days ago. Refund expected to arrive by Apr 14th per bank processing timelines.',
    aiConfidence: 88,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      {
        type: 'positive',
        heading: 'Refund was legitimately processed',
        detail: 'System confirms refund initiated Apr 7th — timing aligns with customer claim',
      },
      {
        type: 'positive',
        heading: 'No prior disputes or chargebacks',
        detail: 'Account has clean history across 12 orders',
      },
      {
        type: 'negative',
        heading: 'Multiple follow-up contacts',
        detail: 'Customer has contacted support 3 times in 7 days — monitor for escalation',
      },
    ],
    quickActions: ['Confirm Refund Status', 'Escalate to Finance', 'Issue Store Credit'],
    orderDetails: {
      orderId: 'ORD-2024-5180',
      orderNumber: '5180-B',
      amount: '$129.00',
      date: 'Apr 2, 2026',
      status: 'Refund Initiated',
      lineItems: [
        { name: 'Running Shoes — Size 9', qty: 1, price: '$129.00' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5180', product: 'Running Shoes — Size 9', amount: '$129.00', date: 'Apr 2, 2026', status: 'Refund Initiated' },
      { orderId: 'ORD-2024-4956', product: 'Yoga Mat — Purple', amount: '$49.99', date: 'Feb 18, 2026', status: 'Delivered' },
    ],
    ticketHistory: [
      { ticketId: '#5180', subject: 'Return request for shoes', date: 'Apr 5, 2026', status: 'resolved' },
    ],
  },
  {
    id: '#5193',
    customer: {
      name: 'Marcus Johnson',
      email: 'marcus.j@email.com',
      initials: 'MJ',
      avatarColor: '#0369a1',
      since: 'Nov 2022',
    },
    subject: 'Package stuck in transit for 10 days',
    preview: "My package (tracking: 1Z999AA10123456784) has been stuck at the Memphis distribution center for 10 days with absolutely no movement. I need this laptop stand urgently for work and have already missed two deadlines waiting for it.",
    category: 'Shipping Issue',
    priority: 'high',
    status: 'open',
    assignee: 'Unassigned',
    assigneeInitials: 'UA',
    timestamp: '1h ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Marcus Johnson',
        content:
          'My package (tracking: 1Z999AA10123456784) has been stuck at the Memphis distribution center for 10 days. No movement at all. I need this for work.',
        timestamp: '8:12 AM',
      },
    ],
    ticketSummary:
      'Package stalled at Memphis distribution center for 10 days with no movement. Customer needs urgent resolution — item is work-critical.',
    aiConfidence: 91,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      {
        type: 'positive',
        heading: 'Tracking confirms stalled shipment',
        detail: 'Carrier data shows no movement since Apr 4th — claim is verifiable',
      },
      {
        type: 'positive',
        heading: 'First-time support contact',
        detail: 'No prior support tickets — customer is not a repeat claimant',
      },
    ],
    quickActions: ['Contact Carrier', 'Reship Order', 'Issue Refund ($59.99)'],
    orderDetails: {
      orderId: 'ORD-2024-5187',
      orderNumber: '5187-C',
      amount: '$59.99',
      date: 'Apr 3, 2026',
      status: 'In Transit',
      lineItems: [
        { name: 'Laptop Stand — Premium', qty: 1, price: '$59.99' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5187', product: 'Laptop Stand — Premium', amount: '$59.99', date: 'Apr 3, 2026', status: 'In Transit' },
      { orderId: 'ORD-2024-4700', product: 'USB-C Hub', amount: '$39.99', date: 'Dec 1, 2025', status: 'Delivered' },
    ],
    ticketHistory: [],
  },
  {
    id: '#5192',
    customer: {
      name: 'Emily Chen',
      email: 'emily.chen@email.com',
      initials: 'EC',
      avatarColor: '#0d9488',
      since: 'Jun 2020',
    },
    subject: 'How do I apply a promo code?',
    preview: "I have a promo code SAVE20 that I received via email but I cannot find a field to enter it anywhere during checkout. I've gone through the entire checkout flow twice and there's no promo code or discount section visible on the page.",
    category: 'General',
    priority: 'normal',
    status: 'open',
    assignee: 'Lisa R.',
    assigneeInitials: 'LR',
    timestamp: '2h ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Emily Chen',
        content:
          "Hi! I have a promo code SAVE20 but I can't figure out where to enter it during checkout. The checkout page doesn't seem to have a promo code field.",
        timestamp: '7:30 AM',
      },
      {
        id: '2',
        sender: 'agent',
        senderName: 'Evo AI',
        content:
          "Hi Emily! The promo code field appears after you add items to your cart and proceed to checkout. It's in the 'Order Summary' section on the right side. Enter SAVE20 there and click 'Apply'. Let me know if you need more help!",
        timestamp: '7:33 AM',
      },
    ],
    ticketSummary:
      'Customer unable to locate the promo code entry field during checkout. Issue resolved by guiding customer to the Order Summary section on the checkout page.',
    aiConfidence: 95,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      {
        type: 'positive',
        heading: 'Long-standing loyal customer',
        detail: 'Customer since Jun 2020 — 6 years, 47 orders, zero incidents',
      },
      {
        type: 'positive',
        heading: 'Non-monetary inquiry',
        detail: 'No refund or compensation requested — information-only ticket',
      },
    ],
    quickActions: ['Guide to Checkout', 'Apply Promo Manually', 'Send Help Article'],
    orderDetails: undefined,
    orderHistory: [
      { orderId: 'ORD-2024-5188', product: 'Ceramic Mug Set', amount: '$28.00', date: 'Apr 9, 2026', status: 'Processing' },
      { orderId: 'ORD-2024-5012', product: 'Bamboo Cutting Board', amount: '$42.50', date: 'Mar 3, 2026', status: 'Delivered' },
    ],
    ticketHistory: [
      { ticketId: '#4800', subject: 'Wrong address on order', date: 'Nov 22, 2025', status: 'resolved' },
    ],
  },
  {
    id: '#5191',
    customer: {
      name: 'David Park',
      email: 'david.park@email.com',
      initials: 'DP',
      avatarColor: '#b45309',
      since: 'Sep 2024',
    },
    subject: 'Want to cancel my order',
    preview: 'I need to cancel order #ORD-2024-5191 immediately because I accidentally ordered the wrong color. I wanted white but selected black. The order was just placed and is still in processing — please cancel it before it ships so I can reorder.',
    category: 'Order Cancellation',
    priority: 'normal',
    status: 'open',
    assignee: 'Unassigned',
    assigneeInitials: 'UA',
    timestamp: '3h ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'David Park',
        content:
          'I need to cancel order #ORD-2024-5191 immediately. I ordered the wrong color. Please cancel before it ships.',
        timestamp: '6:55 AM',
      },
    ],
    ticketSummary:
      'Customer requesting urgent cancellation of order #ORD-2024-5191 due to wrong color selection. Order is currently in processing — cancellation window may be narrow.',
    aiConfidence: 62,
    aiConfidenceLabel: 'Moderate Risk',
    aiSignals: [
      {
        type: 'negative',
        heading: 'New account with limited history',
        detail: 'Account created Sep 2024 — only 3 orders, limited trust signals',
      },
      {
        type: 'negative',
        heading: 'Second cancellation request in 30 days',
        detail: 'Previous cancellation on Mar 21st — pattern may indicate buyer behaviour issues',
      },
      {
        type: 'positive',
        heading: 'Cancellation reason is plausible',
        detail: 'Wrong color/size is a common, legitimate reason for cancellation',
      },
    ],
    quickActions: ['Cancel Order', 'Suggest Exchange', 'Check Stock'],
    orderDetails: {
      orderId: 'ORD-2024-5191',
      orderNumber: '5191-D',
      amount: '$74.99',
      date: 'Apr 14, 2026',
      status: 'Processing',
      lineItems: [
        { name: 'Classic Sneakers — Black', qty: 1, price: '$74.99' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5191', product: 'Classic Sneakers — Black', amount: '$74.99', date: 'Apr 14, 2026', status: 'Processing' },
      { orderId: 'ORD-2024-5050', product: 'Polo Shirt — White', amount: '$45.00', date: 'Mar 18, 2026', status: 'Cancelled' },
    ],
    ticketHistory: [
      { ticketId: '#5052', subject: 'Cancel polo shirt order', date: 'Mar 21, 2026', status: 'resolved' },
    ],
  },
  {
    id: '#5190',
    customer: {
      name: 'Rachel Torres',
      email: 'rachel.t@email.com',
      initials: 'RT',
      avatarColor: '#9333ea',
      since: 'Feb 2022',
    },
    subject: 'Item damaged on arrival',
    preview: 'The floor lamp I ordered (order #ORD-2024-5183) arrived completely shattered inside a crushed box. Every glass piece was broken and the base is cracked. I have photos of both the item and the damaged packaging ready to share. I want a full refund.',
    category: 'Refund',
    priority: 'normal',
    status: 'open',
    assignee: 'Alex M.',
    assigneeInitials: 'AM',
    timestamp: '5h ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Rachel Torres',
        content:
          "The lamp I ordered (order #ORD-2024-5183) arrived completely shattered. The packaging was also damaged. I have photos if needed. I'd like a full refund.",
        timestamp: '4:20 PM',
      },
    ],
    ticketSummary:
      'Customer reports lamp arrived shattered with damaged outer packaging for order #ORD-2024-5183. Photos available on request. Requesting full refund.',
    aiConfidence: 82,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      {
        type: 'positive',
        heading: 'Customer offered photographic evidence',
        detail: 'Proactively offered photos — strong signal of a legitimate damage claim',
      },
      {
        type: 'positive',
        heading: 'Consistent order history',
        detail: '18 orders, 2 previous refunds (11%) — within normal range',
      },
    ],
    quickActions: ['Full Refund ($149.99)', 'Reship Item', 'Request Photos'],
    orderDetails: {
      orderId: 'ORD-2024-5183',
      orderNumber: '5183-E',
      amount: '$149.99',
      date: 'Apr 8, 2026',
      status: 'Delivered',
      lineItems: [
        { name: 'Floor Lamp — Ivory', qty: 1, price: '$149.99' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5183', product: 'Floor Lamp — Ivory', amount: '$149.99', date: 'Apr 8, 2026', status: 'Delivered' },
      { orderId: 'ORD-2024-4900', product: 'Side Table — Oak', amount: '$89.00', date: 'Jan 29, 2026', status: 'Delivered' },
      { orderId: 'ORD-2024-4560', product: 'Wall Clock', amount: '$55.00', date: 'Oct 5, 2025', status: 'Delivered' },
    ],
    ticketHistory: [
      { ticketId: '#4562', subject: 'Wrong colour wall clock', date: 'Oct 7, 2025', status: 'resolved' },
    ],
  },
  {
    id: '#5189',
    customer: {
      name: 'Nina Patel',
      email: 'nina.patel@email.com',
      initials: 'NP',
      avatarColor: '#0891b2',
      since: 'Aug 2021',
    },
    subject: 'Payment charged twice for same order',
    preview: 'I placed order #ORD-2024-5189 and my credit card was charged twice — once for $112.00 and again for $112.00 thirty minutes later. My bank statement clearly shows two separate charges from your store for the exact same amount on the same day.',
    category: 'Refund',
    priority: 'high',
    status: 'open',
    assignee: 'Unassigned',
    assigneeInitials: 'UA',
    timestamp: '6h ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Nina Patel',
        content: 'I was charged twice for my order #ORD-2024-5189. Both charges are $112.00 and appeared within 30 minutes of each other. My bank statement shows two transactions. Please refund the duplicate immediately.',
        timestamp: '3:10 PM',
      },
    ],
    ticketSummary:
      'Customer charged twice ($112.00 each) for order #ORD-2024-5189 within 30 minutes. Duplicate charge confirmed on bank statement — refund of one charge required.',
    aiConfidence: 93,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      { type: 'positive', heading: 'Duplicate charge pattern detected', detail: 'System logs show two payment events for the same order — confirms customer claim' },
      { type: 'positive', heading: 'No prior refund abuse', detail: 'Customer since Aug 2021 with 22 orders and no previous duplicate claims' },
    ],
    quickActions: ['Refund Duplicate ($112.00)', 'Confirm with Finance', 'Send Apology Credit'],
    orderDetails: {
      orderId: 'ORD-2024-5189',
      orderNumber: '5189-F',
      amount: '$112.00',
      date: 'Apr 13, 2026',
      status: 'Processing',
      lineItems: [
        { name: 'Leather Wallet — Brown', qty: 1, price: '$62.00' },
        { name: 'Keychain Set', qty: 2, price: '$25.00' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5189', product: 'Leather Wallet + Keychain Set', amount: '$112.00', date: 'Apr 13, 2026', status: 'Processing' },
      { orderId: 'ORD-2024-4835', product: 'Canvas Backpack', amount: '$78.00', date: 'Jan 20, 2026', status: 'Delivered' },
    ],
    ticketHistory: [],
  },
  {
    id: '#5188',
    customer: {
      name: 'Tom Hargreaves',
      email: 'tom.h@email.com',
      initials: 'TH',
      avatarColor: '#be185d',
      since: 'May 2023',
    },
    subject: 'Missing items from my order',
    preview: 'I received order #ORD-2024-5188 today but two of the three items I ordered are missing from the box. Only the ceramic mug arrived — the bamboo cutting board and the wine glasses were not included despite the packing slip showing all three.',
    category: 'Order',
    priority: 'high',
    status: 'open',
    assignee: 'Sarah Jones',
    assigneeInitials: 'SJ',
    timestamp: '7h ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Tom Hargreaves',
        content: 'I received my order #ORD-2024-5188 but two items are completely missing. The packing slip shows all three items but only the mug was in the box. Where are the cutting board and wine glasses?',
        timestamp: '2:45 PM',
      },
      {
        id: '2',
        sender: 'agent',
        senderName: 'Sarah Jones',
        content: "Hi Tom, I'm so sorry to hear that! I've pulled up your order and I can see the packing slip did list all three items. This looks like a fulfilment error. I'm raising this with the warehouse team right now and will have an update for you within 2 hours.",
        timestamp: '2:55 PM',
      },
    ],
    ticketSummary:
      'Customer received only 1 of 3 items from order #ORD-2024-5188. Ceramic mug arrived but bamboo cutting board and wine glasses are missing despite correct packing slip. Fulfilment investigation in progress.',
    aiConfidence: 89,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      { type: 'positive', heading: 'Packing slip confirms all three items', detail: 'Warehouse records match customer claim — high probability of fulfilment error' },
      { type: 'positive', heading: 'Customer provided detailed account', detail: 'Specific item names and slip reference provided — consistent with genuine claim' },
      { type: 'negative', heading: 'Second partial-shipment claim in 6 months', detail: 'Similar claim raised in Nov 2025 — may warrant extra verification' },
    ],
    quickActions: ['Ship Missing Items', 'Full Refund ($70.50)', 'Warehouse Inquiry'],
    orderDetails: {
      orderId: 'ORD-2024-5188',
      orderNumber: '5188-G',
      amount: '$98.50',
      date: 'Apr 11, 2026',
      status: 'Delivered',
      lineItems: [
        { name: 'Ceramic Mug Set', qty: 1, price: '$28.00' },
        { name: 'Bamboo Cutting Board', qty: 1, price: '$42.50' },
        { name: 'Wine Glass Set (×4)', qty: 1, price: '$28.00' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5188', product: 'Kitchen Bundle', amount: '$98.50', date: 'Apr 11, 2026', status: 'Delivered' },
      { orderId: 'ORD-2024-4720', product: 'Salad Bowl Set', amount: '$34.00', date: 'Nov 14, 2025', status: 'Delivered' },
    ],
    ticketHistory: [
      { ticketId: '#4725', subject: 'Missing salad servers', date: 'Nov 17, 2025', status: 'resolved' },
    ],
  },
  {
    id: '#5187',
    customer: {
      name: 'Grace Liu',
      email: 'grace.liu@email.com',
      initials: 'GL',
      avatarColor: '#16a34a',
      since: 'Mar 2020',
    },
    subject: 'Delivery address change needed',
    preview: 'I accidentally entered my old address when placing order #ORD-2024-5187 yesterday. The correct address is 42 Maple Street, Apt 3B, Chicago, IL 60601. The order is still in processing — please update it before it ships.',
    category: 'Shipping Issue',
    priority: 'normal',
    status: 'open',
    assignee: 'Unassigned',
    assigneeInitials: 'UA',
    timestamp: 'Yesterday',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Grace Liu',
        content: 'Hi, I put the wrong address on my order #ORD-2024-5187. The correct address is 42 Maple Street, Apt 3B, Chicago, IL 60601. Can you update it before it ships?',
        timestamp: 'Yesterday 5:30 PM',
      },
    ],
    ticketSummary:
      'Customer needs delivery address updated on order #ORD-2024-5187 before it ships. Correct address: 42 Maple Street, Apt 3B, Chicago, IL 60601. Order currently in processing.',
    aiConfidence: 96,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      { type: 'positive', heading: 'Loyal long-term customer', detail: 'Customer since Mar 2020 — 51 orders, zero incidents or disputes' },
      { type: 'positive', heading: 'Address change requested before dispatch', detail: 'Order still in processing — change is straightforward and low-risk' },
    ],
    quickActions: ['Update Address', 'Confirm with Warehouse', 'Send Confirmation Email'],
    orderDetails: {
      orderId: 'ORD-2024-5187',
      orderNumber: '5187-H',
      amount: '$55.00',
      date: 'Apr 13, 2026',
      status: 'Processing',
      lineItems: [
        { name: 'Scented Candle Set', qty: 1, price: '$35.00' },
        { name: 'Reed Diffuser', qty: 1, price: '$20.00' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5187', product: 'Home Fragrance Bundle', amount: '$55.00', date: 'Apr 13, 2026', status: 'Processing' },
      { orderId: 'ORD-2024-5010', product: 'Linen Throw Blanket', amount: '$68.00', date: 'Mar 1, 2026', status: 'Delivered' },
    ],
    ticketHistory: [],
  },
  {
    id: '#5186',
    customer: {
      name: 'Oliver Shaw',
      email: 'oliver.s@email.com',
      initials: 'OS',
      avatarColor: '#7c3aed',
      since: 'Oct 2022',
    },
    subject: 'Product warranty claim — faulty zipper',
    preview: 'The zipper on the travel bag I purchased 4 months ago (order #ORD-2024-5050) has completely broken off. The slider detached from the track entirely and the bag is now unusable. The product page stated a 12-month warranty — I would like a replacement.',
    category: 'General',
    priority: 'normal',
    status: 'open',
    assignee: 'Sarah Jones',
    assigneeInitials: 'SJ',
    timestamp: 'Yesterday',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Oliver Shaw',
        content: 'The zipper on my travel bag (order #ORD-2024-5050, purchased Dec 2025) broke after only 4 months. The slider came completely off. Your listing says 12-month warranty. Can I get a replacement?',
        timestamp: 'Yesterday 2:10 PM',
      },
      {
        id: '2',
        sender: 'agent',
        senderName: 'Sarah Jones',
        content: "Hi Oliver, I'm sorry to hear the zipper failed so soon — that's definitely not the quality we expect. I've looked up your order and confirmed it's within the 12-month warranty period. I'll arrange a replacement to be shipped out. Could you send a quick photo of the damage for our quality team records?",
        timestamp: 'Yesterday 3:00 PM',
      },
    ],
    ticketSummary:
      'Customer reporting faulty zipper on travel bag from order #ORD-2024-5050 (Dec 2025) — within 12-month warranty window. Replacement being arranged, photo of defect requested for quality records.',
    aiConfidence: 84,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      { type: 'positive', heading: 'Purchase within warranty window', detail: 'Order placed Dec 2025 — 4 months old, well within the stated 12-month warranty' },
      { type: 'positive', heading: 'Specific defect description', detail: 'Slider detachment is a known manufacturing defect — claim is plausible and specific' },
    ],
    quickActions: ['Send Replacement', 'Issue Store Credit', 'Request Photo Evidence'],
    orderDetails: {
      orderId: 'ORD-2024-5050',
      orderNumber: '5050-I',
      amount: '$94.00',
      date: 'Dec 18, 2025',
      status: 'Delivered',
      lineItems: [
        { name: 'Travel Duffel Bag — Navy', qty: 1, price: '$94.00' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5050', product: 'Travel Duffel Bag — Navy', amount: '$94.00', date: 'Dec 18, 2025', status: 'Delivered' },
      { orderId: 'ORD-2024-4600', product: 'Packing Cubes Set', amount: '$29.00', date: 'Sep 5, 2025', status: 'Delivered' },
    ],
    ticketHistory: [],
  },
  {
    id: '#5185',
    customer: {
      name: 'Fatima Al-Hassan',
      email: 'fatima.ah@email.com',
      initials: 'FA',
      avatarColor: '#d97706',
      since: 'Jul 2019',
    },
    subject: 'Order placed with wrong email address',
    preview: 'I created a new account with a typo in my email address (fatima.al-hassan@email.com instead of fatima.ah@email.com) and placed order #ORD-2024-5185. I cannot receive order confirmation or tracking updates. Please correct the email on my account.',
    category: 'General',
    priority: 'normal',
    status: 'closed',
    assignee: 'Tom K.',
    assigneeInitials: 'TK',
    timestamp: '2 days ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Fatima Al-Hassan',
        content: "I made a typo in my email when creating my account — it should be fatima.ah@email.com not fatima.al-hassan@email.com. I've placed order #ORD-2024-5185 and can't get my confirmation emails. Can you fix the email and resend?",
        timestamp: '2 days ago 11:20 AM',
      },
      {
        id: '2',
        sender: 'agent',
        senderName: 'Tom K.',
        content: "Hi Fatima, no problem at all! I've updated your account email to fatima.ah@email.com and resent the order confirmation and tracking details. You should receive them within a few minutes. Let me know if there's anything else I can help with!",
        timestamp: '2 days ago 11:45 AM',
      },
    ],
    ticketSummary:
      'Customer had typo in account email (al-hassan vs ah) preventing receipt of order confirmation for #ORD-2024-5185. Email corrected and confirmation resent. Ticket resolved.',
    aiConfidence: 97,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      { type: 'positive', heading: 'VIP long-standing customer', detail: 'Customer since Jul 2019 — 7 years, 80+ orders, zero disputes' },
      { type: 'positive', heading: 'Non-monetary request', detail: 'Simple account correction — no financial risk' },
    ],
    quickActions: ['Update Email', 'Resend Confirmation', 'Verify Identity'],
    orderDetails: {
      orderId: 'ORD-2024-5185',
      orderNumber: '5185-J',
      amount: '$210.00',
      date: 'Apr 12, 2026',
      status: 'Processing',
      lineItems: [
        { name: 'Silk Blouse — Ivory', qty: 1, price: '$110.00' },
        { name: 'Wide-leg Trousers — Cream', qty: 1, price: '$100.00' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5185', product: 'Silk Blouse + Trousers', amount: '$210.00', date: 'Apr 12, 2026', status: 'Processing' },
      { orderId: 'ORD-2024-5100', product: 'Cashmere Cardigan', amount: '$180.00', date: 'Mar 15, 2026', status: 'Delivered' },
    ],
    ticketHistory: [
      { ticketId: '#5101', subject: 'Cardigan colour mismatch', date: 'Mar 16, 2026', status: 'resolved' },
    ],
  },
  {
    id: '#5184',
    customer: {
      name: 'Liam Foster',
      email: 'liam.foster@email.com',
      initials: 'LF',
      avatarColor: '#0369a1',
      since: 'Dec 2023',
    },
    subject: 'Cancel subscription — moving abroad',
    preview: 'I need to cancel my monthly replenishment subscription immediately as I am relocating to Germany next week and you do not ship internationally. My subscription ID is SUB-4421 and the next charge is scheduled for Apr 20th — please cancel before then.',
    category: 'Order Cancellation',
    priority: 'normal',
    status: 'open',
    assignee: 'Unassigned',
    assigneeInitials: 'UA',
    timestamp: '2 days ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Liam Foster',
        content: 'Please cancel my subscription (SUB-4421) immediately. I am moving to Germany next week and you do not ship there. The next charge is Apr 20th — please cancel before then so I am not billed.',
        timestamp: '2 days ago 9:00 AM',
      },
    ],
    ticketSummary:
      'Customer requesting cancellation of subscription SUB-4421 due to international relocation to Germany. Next billing date Apr 20, 2026 — cancellation must be processed before that date.',
    aiConfidence: 78,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      { type: 'positive', heading: 'Reason is externally verifiable', detail: 'International move is a common legitimate reason — low fraud risk' },
      { type: 'negative', heading: 'Recent account — limited history', detail: 'Account created Dec 2023 — only 4 months of subscription data available' },
    ],
    quickActions: ['Cancel Subscription', 'Pause Subscription', 'Offer International Shipping'],
    orderDetails: undefined,
    orderHistory: [
      { orderId: 'SUB-4421-MAR', product: 'Monthly Coffee Bundle', amount: '$45.00', date: 'Mar 20, 2026', status: 'Delivered' },
      { orderId: 'SUB-4421-FEB', product: 'Monthly Coffee Bundle', amount: '$45.00', date: 'Feb 20, 2026', status: 'Delivered' },
    ],
    ticketHistory: [],
  },
  {
    id: '#5183',
    customer: {
      name: 'Chloe Nguyen',
      email: 'chloe.n@email.com',
      initials: 'CN',
      avatarColor: '#dc2626',
      since: 'Apr 2021',
    },
    subject: 'Gift wrapping was not included',
    preview: 'I specifically paid $8.00 extra for gift wrapping on order #ORD-2024-5178 as this was a birthday gift. The item arrived in a plain brown box with absolutely no gift wrap, no ribbon, and no personalised note that I also included.',
    category: 'Order',
    priority: 'normal',
    status: 'closed',
    assignee: 'Lisa R.',
    assigneeInitials: 'LR',
    timestamp: '3 days ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Chloe Nguyen',
        content: 'I paid $8 for gift wrapping on order #ORD-2024-5178 and it was completely ignored. No wrapping, no ribbon, and my personalised note was missing too. This was a birthday gift and it was embarrassing.',
        timestamp: '3 days ago 3:20 PM',
      },
      {
        id: '2',
        sender: 'agent',
        senderName: 'Lisa R.',
        content: "Hi Chloe, I sincerely apologise — this should not have happened. I've already refunded the $8.00 gift wrap charge and I've also added a $15 store credit to your account as an apology for the experience. I've flagged this to our packing team so it doesn't happen again.",
        timestamp: '3 days ago 4:00 PM',
      },
    ],
    ticketSummary:
      'Customer paid $8.00 for gift wrapping on order #ORD-2024-5178 but item arrived unpackaged with no note. Gift wrap fee refunded and $15 store credit issued as goodwill. Resolved.',
    aiConfidence: 91,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      { type: 'positive', heading: 'Gift wrap charge confirmed', detail: 'Order record confirms $8.00 gift wrap add-on was selected and charged' },
      { type: 'positive', heading: 'Packing log shows wrap was skipped', detail: 'Warehouse audit confirms gift packaging step was missed for this order' },
    ],
    quickActions: ['Refund Gift Wrap ($8.00)', 'Add Store Credit', 'Apologise & Close'],
    orderDetails: {
      orderId: 'ORD-2024-5178',
      orderNumber: '5178-K',
      amount: '$67.00',
      date: 'Apr 9, 2026',
      status: 'Delivered',
      lineItems: [
        { name: 'Perfume Gift Set', qty: 1, price: '$59.00' },
        { name: 'Gift Wrapping', qty: 1, price: '$8.00' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5178', product: 'Perfume Gift Set', amount: '$67.00', date: 'Apr 9, 2026', status: 'Delivered' },
      { orderId: 'ORD-2024-4890', product: 'Moisturiser Bundle', amount: '$48.00', date: 'Jan 14, 2026', status: 'Delivered' },
    ],
    ticketHistory: [],
  },
  {
    id: '#5182',
    customer: {
      name: 'Arjun Mehta',
      email: 'arjun.m@email.com',
      initials: 'AM',
      avatarColor: '#059669',
      since: 'Jun 2022',
    },
    subject: 'App not showing order tracking',
    preview: 'The mobile app is not showing any tracking information for my most recent order #ORD-2024-5182. The order status just says "Confirmed" and has not updated in 4 days even though I can see movement on the carrier website using the tracking number from my email.',
    category: 'General',
    priority: 'normal',
    status: 'open',
    assignee: 'Sarah Jones',
    assigneeInitials: 'SJ',
    timestamp: '3 days ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Arjun Mehta',
        content: "The app shows 'Confirmed' for order #ORD-2024-5182 for 4 days now. No tracking updates at all. But the carrier website shows it's already out for delivery. Is the app broken?",
        timestamp: '3 days ago 10:00 AM',
      },
      {
        id: '2',
        sender: 'agent',
        senderName: 'Sarah Jones',
        content: "Hi Arjun, thank you for flagging this! There's a known delay in how our app syncs with the carrier tracking data — it can sometimes lag by up to 48 hours. The carrier data is the live source of truth. Your order is on its way! I've flagged this sync issue to our tech team. You should see the app update shortly.",
        timestamp: '3 days ago 10:30 AM',
      },
    ],
    ticketSummary:
      'Mobile app showing stale "Confirmed" status for order #ORD-2024-5182 despite carrier showing active movement. Known tracking sync delay — tech team alerted. Customer reassured.',
    aiConfidence: 98,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      { type: 'positive', heading: 'Known app tracking sync bug', detail: 'Tech team has confirmed this is an active known issue affecting multiple users' },
      { type: 'positive', heading: 'No financial claim', detail: 'Customer seeking information only — zero financial risk' },
    ],
    quickActions: ['Send Tracking Link', 'Escalate to Tech', 'Send App Update Note'],
    orderDetails: {
      orderId: 'ORD-2024-5182',
      orderNumber: '5182-L',
      amount: '$44.00',
      date: 'Apr 10, 2026',
      status: 'In Transit',
      lineItems: [
        { name: 'Wireless Earbuds — White', qty: 1, price: '$44.00' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5182', product: 'Wireless Earbuds', amount: '$44.00', date: 'Apr 10, 2026', status: 'In Transit' },
      { orderId: 'ORD-2024-4950', product: 'Phone Stand', amount: '$18.00', date: 'Feb 25, 2026', status: 'Delivered' },
    ],
    ticketHistory: [],
  },
  {
    id: '#5181',
    customer: {
      name: 'Zara Mitchell',
      email: 'zara.m@email.com',
      initials: 'ZM',
      avatarColor: '#9333ea',
      since: 'Nov 2020',
    },
    subject: 'Return label not received',
    preview: 'I approved a return for order #ORD-2024-5170 four days ago and was told a prepaid return label would be emailed within 24 hours. I have checked all my folders including spam and junk — there is absolutely no label. I cannot return the item without it.',
    category: 'Refund',
    priority: 'high',
    status: 'open',
    assignee: 'Unassigned',
    assigneeInitials: 'UA',
    timestamp: '4 days ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Zara Mitchell',
        content: 'I was supposed to receive a return label for order #ORD-2024-5170 within 24 hours but it has been 4 days and nothing has arrived. I have checked spam. I cannot return the item without the label.',
        timestamp: '4 days ago 1:15 PM',
      },
    ],
    ticketSummary:
      'Customer approved for return on order #ORD-2024-5170 but prepaid return label was not received after 4 days. System may have sent to wrong email. Label needs to be resent.',
    aiConfidence: 85,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      { type: 'positive', heading: 'Return was pre-approved', detail: 'System shows return approval granted 4 days ago — customer claim is consistent' },
      { type: 'negative', heading: 'Email delivery failure not confirmed', detail: 'Email logs show label was sent — may be a deliverability issue or wrong address on file' },
    ],
    quickActions: ['Resend Return Label', 'Check Email Logs', 'Generate New Label'],
    orderDetails: {
      orderId: 'ORD-2024-5170',
      orderNumber: '5170-M',
      amount: '$88.00',
      date: 'Mar 28, 2026',
      status: 'Delivered',
      lineItems: [
        { name: 'Knit Sweater — Olive', qty: 1, price: '$88.00' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5170', product: 'Knit Sweater — Olive', amount: '$88.00', date: 'Mar 28, 2026', status: 'Delivered' },
      { orderId: 'ORD-2024-4810', product: 'Denim Jacket', amount: '$115.00', date: 'Jan 10, 2026', status: 'Delivered' },
    ],
    ticketHistory: [
      { ticketId: '#4815', subject: 'Jacket size exchange', date: 'Jan 12, 2026', status: 'resolved' },
    ],
  },
  {
    id: '#5180',
    customer: {
      name: 'Ben Okafor',
      email: 'ben.o@email.com',
      initials: 'BO',
      avatarColor: '#475569',
      since: 'Aug 2023',
    },
    subject: 'Size exchange for sneakers',
    preview: 'I ordered the Classic Sneakers in size 10 (order #ORD-2024-5175) but they run very small and I need a size 11. I have not worn them — they are still in the original box with tags attached. I would like to exchange them for size 11 in the same colour.',
    category: 'Order',
    priority: 'normal',
    status: 'closed',
    assignee: 'Lisa R.',
    assigneeInitials: 'LR',
    timestamp: '5 days ago',
    messages: [
      {
        id: '1',
        sender: 'customer',
        senderName: 'Ben Okafor',
        content: 'I need to exchange my sneakers (order #ORD-2024-5175) from size 10 to size 11. Still unworn, tags on, in original box.',
        timestamp: '5 days ago 4:00 PM',
      },
      {
        id: '2',
        sender: 'agent',
        senderName: 'Lisa R.',
        content: "Hi Ben, no problem! I've raised an exchange for size 11 — a return label will be emailed within 24 hours. Once we receive the size 10 back, the size 11 will ship same day. You'll also get a $10 credit for the inconvenience.",
        timestamp: '5 days ago 4:30 PM',
      },
    ],
    ticketSummary:
      'Customer exchanging Classic Sneakers size 10 → size 11 for order #ORD-2024-5175. Item unworn in original packaging. Return label sent, size 11 to ship on receipt. $10 credit applied.',
    aiConfidence: 92,
    aiConfidenceLabel: 'Likely Trustworthy',
    aiSignals: [
      { type: 'positive', heading: 'Item confirmed unworn', detail: 'Customer confirmed tags attached and original packaging intact — consistent with genuine exchange' },
      { type: 'positive', heading: 'No monetary refund requested', detail: 'Customer requesting exchange only — straightforward logistics case' },
    ],
    quickActions: ['Process Exchange', 'Send Return Label', 'Check Size Availability'],
    orderDetails: {
      orderId: 'ORD-2024-5175',
      orderNumber: '5175-N',
      amount: '$74.99',
      date: 'Apr 7, 2026',
      status: 'Delivered',
      lineItems: [
        { name: 'Classic Sneakers — White, Size 10', qty: 1, price: '$74.99' },
      ],
    },
    orderHistory: [
      { orderId: 'ORD-2024-5175', product: 'Classic Sneakers — White', amount: '$74.99', date: 'Apr 7, 2026', status: 'Delivered' },
      { orderId: 'ORD-2024-4940', product: 'Crew Socks Pack', amount: '$14.00', date: 'Feb 20, 2026', status: 'Delivered' },
    ],
    ticketHistory: [],
  },
];

export const aiSuggestions = [
  "I'll arrange express shipping for the correct item right away — you'll receive a tracking number within the hour.",
  "I can process a full refund to your original payment method. It should appear within 3–5 business days.",
  "Let me escalate this to our fulfillment team for urgent resolution.",
  "I'd like to offer you a $20 store credit for the inconvenience caused.",
  "Our warehouse team will investigate this and follow up within 24 hours.",
  "I've contacted the carrier and requested a priority investigation on your package.",
];

export const rewriteSamples: Record<string, string> = {
  friendly:
    "Hey there! Thanks so much for reaching out 😊 I totally understand how frustrating this must be, and I really want to help make it right. I've gone ahead and arranged for the correct item to be shipped to you with express delivery — you should receive a tracking number shortly. Please don't hesitate to reach out if there's anything else I can do!",
  professional:
    "Thank you for bringing this to our attention. I sincerely apologise for the inconvenience caused by this fulfilment error. I have arranged for the correct item to be dispatched via express delivery. You will receive a tracking confirmation within the hour. Please let me know if you require any further assistance.",
  casual:
    "Hey! Really sorry about the mix-up — that's on us. I've sorted out the replacement and it'll be shipped with express delivery so you get it on time. Tracking info coming your way soon. Let me know if you need anything else!",
  proofread:
    "I received the wrong item in my order. I ordered a blue hoodie in size M but received a red T-shirt in size L (Order #ORD-2024-5195). Could you please help me receive the correct item?",
};
