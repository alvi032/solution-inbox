'use client';

import { useState, useRef } from 'react';
import { Ticket } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  SquarePen,
  ShoppingBag,
  CircleCheckBig,
  Archive,
  ShieldAlert,
  ShoppingCart,
  Ticket as TicketIcon,
  UserRound,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import AiConfidenceTooltip from './ai-confidence-tooltip';

interface DetailPanelProps {
  ticket: Ticket;
  effectiveStatus: 'open' | 'closed';
  isArchived: boolean;
  showResolvedBanner: boolean;
  isSpam: boolean;
  onArchive: () => void;
  onUnarchive: () => void;
  onResolve: () => void;
  onReopen: () => void;
  onMarkSpam: () => void;
  onUnmarkSpam: () => void;
}

function ConfidenceBar({ ticket }: { ticket: Ticket }) {
  const [show, setShow] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, right: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const pct = ticket.aiConfidence;
  const barColor = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-500';

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top,
        right: window.innerWidth - rect.left + 8,
      });
    }
    setShow(true);
  };

  return (
    <>
      <div
        ref={ref}
        className="px-4 py-3 border-b border-[#e4e4e7] cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#18181b]">AI Confidence</span>
          <span className="text-sm font-semibold text-[#18181b]">{pct}%</span>
        </div>
        <div className="h-1.5 w-full bg-[#f4f4f5] rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-xs text-[#71717a]">{ticket.aiConfidenceLabel}</p>
      </div>

      {show && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ top: tooltipPos.top, right: tooltipPos.right }}
        >
          <AiConfidenceTooltip ticket={ticket} />
        </div>
      )}
    </>
  );
}

function SectionHeader({
  icon,
  label,
  actions,
}: {
  icon: React.ReactNode;
  label: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#f4f4f5] border-b border-[#e5e7eb]">
      <span className="text-[#71717a] shrink-0">{icon}</span>
      <span className="text-sm font-semibold text-[#18181b] flex-1">{label}</span>
      {actions}
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start text-xs gap-4 py-2 border-b border-[#f4f4f5] last:border-0">
      <span className="text-[#71717a] shrink-0">{label}</span>
      <span className="text-[#18181b] font-medium text-right">{value}</span>
    </div>
  );
}

function DetailsTab({ ticket }: { ticket: Ticket }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: ticket.customer.name,
    email: ticket.customer.email,
    phone: ticket.customer.phone,
    address: ticket.customer.address,
  });
  const [saved, setSaved] = useState(draft);

  const handleSave = () => {
    setSaved(draft);
    setEditing(false);
  };
  const handleCancel = () => {
    setDraft(saved);
    setEditing(false);
  };

  return (
    <div>
      {/* Ticket Details */}
      <SectionHeader icon={<TicketIcon size={14} />} label="Ticket Details" />
      <div className="px-4 py-1">
        <FieldRow label="Ticket ID" value={ticket.id} />
        <FieldRow label="Assignee" value={ticket.assignee} />
        <FieldRow label="Status" value={ticket.status === 'open' ? 'Open' : 'Closed'} />
        <FieldRow label="Category" value={ticket.category} />
        <FieldRow label="Priority" value={ticket.priority === 'high' ? 'High' : 'Normal'} />
        <FieldRow label="Created" value="Apr 8, 09:29 PM" />
      </div>

      {/* Customer Details */}
      <SectionHeader
        icon={<UserRound size={14} />}
        label="Customer Details"
        actions={
          !editing && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 h-6 px-2 rounded border border-[#e4e4e7] bg-white text-[#18181b] text-[11px] font-medium hover:bg-[#f4f4f5] transition-colors"
              >
                <SquarePen size={11} />
                Edit
              </button>
              <button
                className="flex items-center gap-1 h-6 px-2 rounded border border-[#e4e4e7] bg-white text-[#18181b] text-[11px] font-medium hover:bg-[#f4f4f5] transition-colors"
                title="View in Shopify"
              >
                <ExternalLink size={11} />
                Shopify
              </button>
            </div>
          )
        }
      />

      {editing ? (
        <div className="px-4 pt-3 pb-2 space-y-2.5">
          {[
            { label: 'Name', key: 'name' },
            { label: 'Email', key: 'email' },
            { label: 'Phone', key: 'phone' },
            { label: 'Address', key: 'address' },
          ].map(({ label, key }) => (
            <div key={key}>
              <p className="text-[10px] font-medium text-[#71717a] mb-1">{label}</p>
              <Input
                value={draft[key as keyof typeof draft]}
                onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                className="h-8 text-xs border-[#e4e4e7] focus-visible:border-[#a1a1aa]"
              />
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#18181b] text-white text-xs font-medium hover:bg-zinc-700 transition-colors"
            >
              <Check size={12} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-[#e4e4e7] bg-white text-[#18181b] text-xs font-medium hover:bg-[#f4f4f5] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-1">
          <FieldRow label="Name" value={saved.name} />
          <FieldRow label="Email" value={saved.email} />
          <FieldRow label="Phone" value={saved.phone} />
          <FieldRow label="Address" value={saved.address} />
          <FieldRow label="User Since" value={ticket.customer.since} />
        </div>
      )}

      {/* Order Details */}
      {ticket.orderDetails && (
        <>
          <SectionHeader
            icon={<ShoppingCart size={14} />}
            label="Order Details"
            actions={
              <button
                className="flex items-center gap-1 h-6 px-2 rounded border border-[#e4e4e7] bg-white text-[#18181b] text-[11px] font-medium hover:bg-[#f4f4f5] transition-colors"
                title="View in Shopify"
              >
                <ExternalLink size={11} />
                Shopify
              </button>
            }
          />
          <div className="px-4 py-1">
            <FieldRow label="Order Number" value={ticket.orderDetails.orderNumber} />
            <FieldRow label="Placed on" value={ticket.orderDetails.date} />
            <FieldRow label="Status" value={ticket.orderDetails.status} />
            <FieldRow label="Total" value={ticket.orderDetails.amount} />
          </div>

          {/* Invoice */}
          <div className="px-4 pb-4">
            <div className="border border-[#e4e4e7] rounded-lg overflow-hidden">
              <div className="bg-[#f4f4f5] px-3 py-2 border-b border-[#e4e4e7]">
                <p className="text-xs font-semibold text-[#18181b]">Invoice</p>
              </div>
              <div className="divide-y divide-[#f4f4f5]">
                {ticket.orderDetails.lineItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2.5 gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#18181b]">{item.name}</p>
                      <p className="text-[11px] text-[#71717a]">Qty: {item.qty}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#18181b] shrink-0">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-3 py-2 border-t border-[#e4e4e7] bg-[#fafafa]">
                <span className="text-xs font-semibold text-[#18181b]">Total</span>
                <span className="text-xs font-bold text-[#18181b]">{ticket.orderDetails.amount}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function OrderHistoryTab({ ticket }: { ticket: Ticket }) {
  if (ticket.orderHistory.length === 0) {
    return <p className="px-4 py-6 text-sm text-[#71717a] text-center">No order history available.</p>;
  }
  return (
    <div className="divide-y divide-[#f4f4f5]">
      {ticket.orderHistory.map((order) => (
        <div key={order.orderId} className="px-4 py-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#18181b] truncate">{order.product}</p>
            <p className="text-[11px] text-[#71717a]">{order.orderId} · {order.date}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold text-[#18181b]">{order.amount}</p>
            <Badge
              variant="outline"
              className={cn(
                'text-[10px] px-1.5 py-0 mt-1 border-0',
                order.status === 'Delivered' && 'text-green-700 bg-green-50',
                order.status === 'In Transit' && 'text-blue-700 bg-blue-50',
                order.status === 'Processing' && 'text-amber-700 bg-amber-50',
                order.status === 'Cancelled' && 'text-red-600 bg-red-50',
                order.status === 'Refund Initiated' && 'text-purple-700 bg-purple-50',
              )}
            >
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function TicketHistoryTab({ ticket }: { ticket: Ticket }) {
  if (ticket.ticketHistory.length === 0) {
    return <p className="px-4 py-6 text-sm text-[#71717a] text-center">No previous tickets.</p>;
  }
  return (
    <div className="divide-y divide-[#f4f4f5]">
      {ticket.ticketHistory.map((t) => (
        <div key={t.ticketId} className="px-4 py-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#18181b] truncate">{t.subject}</p>
            <p className="text-[11px] text-[#71717a]">{t.ticketId} · {t.date}</p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'text-[10px] px-1.5 py-0 shrink-0 border-0',
              t.status === 'resolved' && 'text-green-700 bg-green-50',
              t.status === 'closed' && 'text-zinc-600 bg-zinc-100',
              t.status === 'open' && 'text-blue-700 bg-blue-50',
            )}
          >
            {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
          </Badge>
        </div>
      ))}
    </div>
  );
}

export default function DetailPanel({
  ticket,
  effectiveStatus,
  isArchived,
  showResolvedBanner,
  isSpam,
  onArchive,
  onUnarchive,
  onResolve,
  onReopen,
  onMarkSpam,
  onUnmarkSpam,
}: DetailPanelProps) {
  const isClosed = effectiveStatus === 'closed';
  const activeState = showResolvedBanner ? 'resolved' : isArchived ? 'archived' : isSpam ? 'spam' : null;

  const statusBanner: Record<string, { label: string; action: string; color: string; onUndo: () => void }> = {
    resolved: { label: 'Ticket resolved — moved to Closed.', action: 'Reopen', color: 'bg-green-50 border-green-200 text-green-800', onUndo: onReopen },
    archived: { label: 'Ticket archived.', action: 'Unarchive', color: 'bg-amber-50 border-amber-200 text-amber-800', onUndo: onUnarchive },
    spam: { label: 'Ticket marked as spam.', action: 'Not Spam', color: 'bg-red-50 border-red-200 text-red-800', onUndo: onUnmarkSpam },
  };

  return (
    <div className="w-[400px] shrink-0 flex flex-col h-full border-l border-[#e5e7eb] bg-white overflow-hidden">

      {/* Action buttons header */}
      <div className="flex items-center gap-2 px-4 h-[60px] border-b border-[#e5e7eb] shrink-0">
        {isClosed ? (
          <button onClick={onReopen} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#f4f4f5] text-[#18181b] text-xs font-medium hover:bg-[#e9e9eb] transition-colors">
            <CircleCheckBig size={14} />
            Reopen
          </button>
        ) : (
          <button onClick={onResolve} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#16a34a] text-white text-xs font-medium hover:bg-green-700 transition-colors">
            <CircleCheckBig size={14} />
            Mark Resolved
          </button>
        )}
        {isArchived ? (
          <button onClick={onUnarchive} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-amber-100 text-amber-800 text-xs font-medium hover:bg-amber-200 transition-colors">
            <Archive size={14} />
            Unarchive
          </button>
        ) : (
          <button onClick={onArchive} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#f4f4f5] text-[#18181b] text-xs font-medium hover:bg-[#e9e9eb] transition-colors">
            <Archive size={14} />
            Archive
          </button>
        )}
        {isSpam ? (
          <button onClick={onUnmarkSpam} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-colors">
            <ShieldAlert size={14} />
            Not Spam
          </button>
        ) : (
          <button onClick={onMarkSpam} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#f4f4f5] text-[#18181b] text-xs font-medium hover:bg-[#e9e9eb] transition-colors">
            <ShieldAlert size={14} />
            Mark Spam
          </button>
        )}
      </div>

      {/* Status banner with undo */}
      {activeState && (
        <div className={`flex items-center justify-between px-4 py-2 border-b text-xs font-medium ${statusBanner[activeState].color}`}>
          <span>{statusBanner[activeState].label}</span>
          <button
            onClick={statusBanner[activeState].onUndo}
            className="underline underline-offset-2 hover:opacity-70 transition-opacity ml-3 shrink-0"
          >
            {statusBanner[activeState].action}
          </button>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Ticket Summary */}
        <div className="px-4 py-3 border-b border-[#e4e4e7]">
          <p className="text-xs font-semibold text-[#18181b] mb-2">Ticket Summary</p>
          <p className="text-xs text-[#18181b] leading-relaxed">{ticket.ticketSummary}</p>
        </div>

        {/* AI Confidence — hover to see legibility card */}
        <ConfidenceBar ticket={ticket} />

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full rounded-none border-b border-[#e4e4e7] bg-transparent h-auto p-0">
            {[
              { value: 'details', label: 'Details' },
              { value: 'orders', label: 'Order History' },
              { value: 'history', label: 'Ticket History' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#18181b] data-[state=active]:shadow-none data-[state=active]:bg-transparent text-xs py-2.5 text-[#71717a] data-[state=active]:text-[#18181b] font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="details" className="mt-0">
            <DetailsTab ticket={ticket} />
          </TabsContent>
          <TabsContent value="orders" className="mt-0">
            <OrderHistoryTab ticket={ticket} />
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <TicketHistoryTab ticket={ticket} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
