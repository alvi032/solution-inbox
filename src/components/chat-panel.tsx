'use client';

import { useState, useRef, useEffect } from 'react';
import { Ticket, Category, rewriteSamples } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sparkles,
  Send,
  ChevronsUpDown,
  WandSparkles,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  ListOrdered,
  List,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  RotateCcw,
} from 'lucide-react';

interface ChatPanelProps {
  ticket: Ticket;
  onClose: () => void;
  ticketIndex: number;
  ticketTotal: number;
  onNavigate: (dir: 'prev' | 'next') => void;
  effectiveStatus: 'open' | 'closed';
  onReopen: () => void;
}

function MessageBubble({ message }: { message: Ticket['messages'][0] }) {
  const isAgent = message.sender === 'agent';
  return (
    <div className={cn('flex flex-col gap-1', isAgent ? 'items-end' : 'items-start')}>
      <div className="flex items-center gap-1.5 px-0.5">
        <span className="text-[10px] font-medium text-[#71717a]">{message.senderName}</span>
        <span className="text-[10px] text-[#a1a1aa]">{message.timestamp}</span>
      </div>
      <div
        className={cn(
          'max-w-[80%] px-4 py-2 text-sm leading-relaxed whitespace-pre-line rounded-lg',
          isAgent ? 'bg-[#f4f4f5] text-[#18181b]' : 'bg-[#f4f4f5] text-[#18181b]'
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

const categoryStyles: Record<Category, string> = {
  Order: 'bg-[#ede9fe] text-[#5b21b6] border-[#ede9fe]',
  Refund: 'bg-[#fef3c7] text-[#92400e] border-[#fef3c7]',
  'Shipping Issue': 'bg-[#dbeafe] text-[#1e40af] border-[#dbeafe]',
  General: 'bg-[#dbfedd] text-[#0f6229] border-[#dbfedd]',
  'Order Cancellation': 'bg-[#ede9fe] text-[#5b21b6] border-[#ede9fe]',
};

const quickActionResponses: Record<string, string> = {
  'Replace Product': "Hi, I've arranged for the correct item to be shipped out with express delivery. You'll receive a tracking confirmation shortly. Apologies for the inconvenience!",
  'Full Refund ($89.99)': "I've processed a full refund of $89.99 to your original payment method. Please allow 3–5 business days for it to appear. I apologise for the trouble caused.",
  'Store Credit ($89.99)': "I've added $89.99 in store credit to your account — it's available immediately and never expires. I'm sorry for the inconvenience.",
  'Confirm Refund Status': "I've checked on your refund and can confirm it was processed on Apr 7th. It should appear in your account within 1–2 more business days. Thank you for your patience.",
  'Escalate to Finance': "I'm escalating your refund query to our finance team and they'll follow up with you directly within 24 hours. I apologise for the delay.",
  'Issue Store Credit': "I've added equivalent store credit to your account as a gesture of goodwill while the refund is processed. It's available immediately.",
  'Contact Carrier': "I've flagged your shipment with the carrier and requested a priority investigation. You should receive an update within 24 hours.",
  'Reship Order': "I've arranged a reship of your order with express delivery at no extra cost. A new tracking number will be sent shortly.",
  'Issue Refund ($59.99)': "I've processed a full refund of $59.99 to your original payment method. Please allow 3–5 business days.",
  'Guide to Checkout': "To apply your promo code, go to your cart and click 'Checkout'. On the order summary page on the right side, you'll see a 'Promo Code' field. Enter your code there and click 'Apply'.",
  'Apply Promo Manually': "I've manually applied the promo code SAVE20 to your order. You should see the discount reflected at checkout now.",
  'Send Help Article': "I've sent a help article to your email with step-by-step instructions on applying promo codes. Let me know if you have any questions!",
  'Cancel Order': "I've submitted a cancellation request for order #ORD-2024-5191. You'll receive a confirmation email within the hour. If it's already shipped, we'll arrange a free return.",
  'Suggest Exchange': "Instead of cancelling, I can arrange an exchange for the correct color/size. Would you like me to proceed with that? No return shipping required.",
  'Check Stock': "I've checked our inventory — the item is available in multiple colors. Would you like me to update your order to a different variant instead?",
  'Full Refund ($149.99)': "I've processed a full refund of $149.99 for the damaged item. Please allow 3–5 business days for it to appear. I'm truly sorry about this experience.",
  'Reship Item': "I've arranged a replacement to be shipped with extra protective packaging. You'll receive tracking details within the hour.",
  'Request Photos': "Could you please share photos of the damage? This will help us file a claim with the carrier and ensure this doesn't happen again.",
};

export default function ChatPanel({ ticket, onClose, ticketIndex, ticketTotal, onNavigate, effectiveStatus, onReopen }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(ticket.messages);
  const [actionsExpanded, setActionsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(ticket.messages);
    setInput('');
  }, [ticket.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'agent',
        senderName: 'You',
        content: input.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
  };

  const handleQuickAction = (action: string) => {
    const response = quickActionResponses[action] ?? `I'll ${action.toLowerCase()} right away.`;
    setInput(response);
  };

  const handleAiAssist = (type: string) => {
    if (!rewriteSamples[type]) return;
    setIsProcessing(true);
    setTimeout(() => {
      setInput(rewriteSamples[type]);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-white min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-[#e5e7eb] shrink-0 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-medium text-[#18181b] truncate">{ticket.subject}</h2>
          <span className="text-xs text-[#a1a1aa] shrink-0">·</span>
          <span className="text-xs text-[#71717a] shrink-0">Ticket {ticket.id}</span>
          <Badge
            variant="outline"
            className={cn('shrink-0 rounded-full text-[10px] px-2 py-0 font-medium border-0', categoryStyles[ticket.category])}
          >
            {ticket.category}
          </Badge>
        </div>
        {/* Navigation counter */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onNavigate('prev')}
            disabled={ticketTotal <= 1}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[#71717a] hover:bg-[#f4f4f5] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="h-7 px-2.5 flex items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-xs text-[#18181b] tabular-nums">
            {ticketIndex + 1} / {ticketTotal}
          </div>
          <button
            onClick={() => onNavigate('next')}
            disabled={ticketTotal <= 1}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[#71717a] hover:bg-[#f4f4f5] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Ticket conclusion (closed) or compose area (open) */}
      {effectiveStatus === 'closed' ? (
        <div className="border-t border-[#e5e7eb] bg-[#fafafa] p-4 shrink-0">
          <div className="border border-[#e4e4e7] rounded-lg bg-white overflow-hidden">
            {/* Conclusion header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#f4f4f5] bg-green-50">
              <CircleCheckBig size={15} className="text-green-600 shrink-0" />
              <span className="text-sm font-semibold text-green-800">Ticket Resolved</span>
            </div>
            {/* Resolution text */}
            <div className="px-4 py-3">
              <p className="text-sm text-[#18181b] leading-relaxed">{ticket.resolution}</p>
            </div>
            {/* Reopen CTA */}
            <div className="px-4 pb-3">
              <button
                onClick={onReopen}
                className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-[#e4e4e7] bg-white text-[#18181b] text-xs font-medium hover:bg-[#f4f4f5] transition-colors"
              >
                <RotateCcw size={13} />
                Reopen Ticket
              </button>
            </div>
          </div>
        </div>
      ) : (
      <div className="border-t border-[#e5e7eb] bg-[#fafafa] p-3 shrink-0">
        <div className="border border-[#e4e4e7] rounded-lg bg-white overflow-hidden focus-within:border-[#a1a1aa] transition-colors">

          {/* Quick action chips row */}
          <div className="flex items-center justify-between px-3 pt-2.5 pb-2 gap-2">
            <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
              {(actionsExpanded ? ticket.quickActions : ticket.quickActions.slice(0, 3)).map((action) => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  className="text-xs text-[#18181b] bg-[#f4f4f5] hover:bg-[#e9e9eb] rounded-md px-2.5 h-8 shrink-0 transition-colors font-medium"
                >
                  {action}
                </button>
              ))}
            </div>
            <button
              onClick={() => setActionsExpanded((v) => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-[#f4f4f5] text-[#71717a] hover:text-[#18181b] transition-colors shrink-0"
              title={actionsExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronsUpDown size={14} />
            </button>
          </div>

          {/* Textarea */}
          <Textarea
            placeholder="Write a reply..."
            value={isProcessing ? 'Rewriting...' : input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend();
            }}
            className="border-0 shadow-none focus-visible:ring-0 resize-none h-[100px] text-sm text-[#18181b] placeholder:text-[#a1a1aa] rounded-none px-3"
          />

          {/* Formatting toolbar */}
          <div className="flex items-center justify-between px-2 py-2 border-t border-[#f4f4f5]">
            {/* Left: formatting buttons */}
            <div className="flex items-center gap-0.5">
              {[
                { icon: <Bold size={14} />, title: 'Bold' },
                { icon: <Italic size={14} />, title: 'Italic' },
                { icon: <Underline size={14} />, title: 'Underline' },
                { icon: <Strikethrough size={14} />, title: 'Strikethrough' },
              ].map(({ icon, title }) => (
                <button
                  key={title}
                  title={title}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                >
                  {icon}
                </button>
              ))}
              <div className="w-px h-4 bg-[#e4e4e7] mx-1" />
              {[
                { icon: <Link size={14} />, title: 'Link' },
                { icon: <ListOrdered size={14} />, title: 'Ordered List' },
                { icon: <List size={14} />, title: 'Unordered List' },
                { icon: <Paperclip size={14} />, title: 'Attachment' },
              ].map(({ icon, title }) => (
                <button
                  key={title}
                  title={title}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Right: AI Assist + Send */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 h-8 rounded-md px-2.5 text-xs text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer border border-[#e4e4e7]">
                  <WandSparkles size={13} />
                  AI Assist
                  <Sparkles size={11} className="text-[#a1a1aa]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleAiAssist('proofread')} className="text-sm gap-2">
                    <Sparkles size={13} />
                    Proof-read
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-sm gap-2">
                      <WandSparkles size={13} />
                      Rewrite
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => handleAiAssist('friendly')} className="text-sm">Friendly</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAiAssist('professional')} className="text-sm">Professional</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAiAssist('casual')} className="text-sm">Casual</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                className="h-8 text-xs gap-1.5 bg-[#18181b] hover:bg-zinc-700 text-white rounded-md px-3"
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
              >
                <Send size={12} />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
