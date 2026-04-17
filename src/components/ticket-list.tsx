'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { tickets, Ticket, Category } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Archive, SquareCheckBig } from 'lucide-react';
import FilterButton, { FilterState } from '@/components/filter-panel';

// The logged-in user — tickets assigned to this name appear under "My Tickets"
const CURRENT_USER = 'Sarah Jones';

type TabFilter = 'All' | 'Open' | 'Closed';

const categoryStyles: Record<Category, string> = {
  Order: 'bg-[#ede9fe] text-[#5b21b6] border-[#ede9fe]',
  Refund: 'bg-[#fef3c7] text-[#92400e] border-[#fef3c7]',
  'Shipping Issue': 'bg-[#dbeafe] text-[#1e40af] border-[#dbeafe]',
  General: 'bg-[#dbfedd] text-[#0f6229] border-[#dbfedd]',
  'Order Cancellation': 'bg-[#ede9fe] text-[#5b21b6] border-[#ede9fe]',
};

const AGENTS = [
  { name: 'Unassigned', initials: 'UA', color: '#a1a1aa' },
  { name: 'Sarah Jones', initials: 'SJ', color: '#0d9488' },
  { name: 'Alex M.', initials: 'AM', color: '#7c3aed' },
  { name: 'Lisa R.', initials: 'LR', color: '#0369a1' },
  { name: 'Tom K.', initials: 'TK', color: '#b45309' },
];

interface TicketListProps {
  selectedId: string | null;
  onSelect: (ticket: Ticket) => void;
  narrow?: boolean;
  activeView: string;
  archivedIds: Set<string>;
  spamIds: Set<string>;
  statusOverrides: Record<string, 'open' | 'closed'>;
  onArchive: (id: string) => void;
  onFilteredChange?: (tickets: Ticket[]) => void;
}

function AgentPicker({
  current,
  onSelect,
  onClose,
}: {
  current: string;
  onSelect: (agent: typeof AGENTS[0]) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 z-50 mt-1 w-44 bg-white border border-[#e4e4e7] rounded-lg shadow-md overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-[#f4f4f5]">
        <p className="text-[10px] font-semibold text-[#a1a1aa] uppercase tracking-wide">Assign to</p>
      </div>
      {AGENTS.map((agent) => (
        <button
          key={agent.name}
          onClick={() => { onSelect(agent); onClose(); }}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors hover:bg-[#f4f4f5]',
            current === agent.name ? 'text-[#18181b] font-medium' : 'text-[#71717a]'
          )}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ fontSize: '8px', fontWeight: 700, backgroundColor: agent.color }}
          >
            {agent.initials}
          </div>
          <span className="truncate">{agent.name}</span>
          {current === agent.name && (
            <span className="ml-auto text-[#18181b]">✓</span>
          )}
        </button>
      ))}
    </div>
  );
}

// Wide row layout — used when no ticket is open (full width list)
function WideTicketRow({
  ticket,
  isSelected,
  onSelect,
  onArchive,
  effectiveStatus,
  isArchived,
  isSpam,
}: {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: () => void;
  onArchive: () => void;
  effectiveStatus: 'open' | 'closed';
  isArchived: boolean;
  isSpam: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [assignee, setAssignee] = useState({ name: ticket.assignee, initials: ticket.assigneeInitials });

  return (
    <div
      className={cn(
        'relative flex items-center gap-4 px-4 py-3 border-b border-[#f4f4f5] cursor-pointer transition-colors',
        ticket.priority === 'high' ? 'border-l-4 border-l-[#ff6666]' : 'border-l-4 border-l-transparent',
        isSelected ? 'bg-[#f4f4f5]' : isArchived ? 'bg-[#fefce8] hover:bg-[#fef9c3]' : isSpam ? 'bg-[#fff5f5] hover:bg-[#fee2e2]' : effectiveStatus === 'closed' ? 'bg-[#f0fdf4] hover:bg-[#ecfdf5]' : 'bg-[#fafafa] hover:bg-white'
      )}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Customer (w-[100px]) */}
      <div className="w-[100px] shrink-0 flex flex-col gap-0.5">
        <span className="text-sm text-[#18181b] truncate">{ticket.customer.name}</span>
        <span className="text-xs text-[#71717a]">Customer</span>
      </div>

      {/* Subject + Preview — fills all remaining space */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5 overflow-hidden">
        <span className="text-sm font-medium text-[#18181b] break-words">{ticket.subject}</span>
        <span className="text-xs text-[#71717a] truncate">{ticket.preview}</span>
      </div>

      {/* Badge — fixed width so subject column gets exact remaining space */}
      <div className="w-[140px] shrink-0 flex items-center">
        <Badge
          variant="outline"
          className={cn('rounded-full text-[11px] px-2.5 py-0.5 font-medium border-0', categoryStyles[ticket.category])}
        >
          {ticket.category}
        </Badge>
      </div>

      {/* Assignee (w-[120px]) — wide enough for "Unassigned" without truncation */}
      <div
        className="relative w-[120px] shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowAgentPicker((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 w-full px-1.5 py-1 rounded-md transition-colors text-left',
            showAgentPicker ? 'bg-[#f4f4f5]' : 'hover:bg-[#f4f4f5]'
          )}
        >
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ fontSize: '8px', fontWeight: 700, backgroundColor: AGENTS.find(a => a.name === assignee.name)?.color ?? '#a1a1aa' }}
          >
            {assignee.initials}
          </div>
          <span className="text-xs text-[#71717a] truncate">{assignee.name}</span>
        </button>
        {showAgentPicker && (
          <AgentPicker
            current={assignee.name}
            onSelect={(agent) => setAssignee({ name: agent.name, initials: agent.initials })}
            onClose={() => setShowAgentPicker(false)}
          />
        )}
      </div>

      {/* Hover actions — fixed width reserved even when invisible */}
      <div
        className={cn(
          'w-[100px] shrink-0 flex items-center gap-0.5 transition-opacity',
          hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          title="View"
          onClick={onSelect}
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
        >
          <Eye size={15} />
        </button>
        <button
          title="Archive"
          onClick={onArchive}
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
        >
          <Archive size={15} />
        </button>
        <button
          title="Mark Resolved"
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
        >
          <SquareCheckBig size={15} />
        </button>
      </div>

      {/* Timestamp (w-[100px]) */}
      <div className="w-[100px] shrink-0 text-right">
        <span className="text-sm text-[#3f3f46]">{ticket.timestamp}</span>
      </div>
    </div>
  );
}

// Narrow row layout — used when a ticket is open (300px panel)
function NarrowTicketRow({
  ticket,
  isSelected,
  onSelect,
}: {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 px-4 py-4 border-b border-[#f4f4f5] cursor-pointer transition-colors',
        ticket.priority === 'high' ? 'border-l-4 border-l-[#ff6666]' : 'border-l-4 border-l-transparent',
        isSelected ? 'bg-[#f4f4f5]' : 'bg-[#fafafa] hover:bg-white'
      )}
      onClick={onSelect}
    >
      {/* Top row: name + badge + timestamp */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm text-[#18181b] truncate">{ticket.customer.name}</span>
          <Badge
            variant="outline"
            className={cn('shrink-0 rounded-full text-[10px] px-2 py-0 font-medium border-0', categoryStyles[ticket.category])}
          >
            {ticket.category}
          </Badge>
        </div>
        <span className="text-xs text-[#3f3f46] shrink-0">{ticket.timestamp}</span>
      </div>
      {/* Subject */}
      <p className="text-sm font-medium text-[#18181b]">{ticket.subject}</p>
      {/* Preview */}
      <p className="text-xs text-[#71717a] line-clamp-2 leading-4">{ticket.preview}</p>
    </div>
  );
}

function getViewTitle(activeView: string): string {
  const titles: Record<string, string> = {
    Inbox: 'All Tickets',
    'My Tickets': 'My Tickets',
    Unassigned: 'Unassigned',
    Archived: 'Archived',
    Spam: 'Spam',
  };
  return titles[activeView] ?? activeView;
}

const VIEWS_WITHOUT_TABS = ['Archived', 'Spam'];

export default function TicketList({ selectedId, onSelect, narrow, activeView, archivedIds, spamIds, statusOverrides, onArchive, onFilteredChange }: TicketListProps) {
  const [tab, setTab] = useState<TabFilter>('All');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>({});

  // Reset tab and search when switching views
  useEffect(() => {
    setTab('All');
    setSearch('');
  }, [activeView]);

  const effectiveStatus = (t: Ticket): 'open' | 'closed' => statusOverrides[t.id] ?? t.status;

  // Base tickets for the current view (before tab + search)
  const viewTickets = useMemo(() => tickets.filter((t) => {
    if (activeView === 'Archived') return archivedIds.has(t.id);
    if (activeView === 'Spam') return spamIds.has(t.id);
    // Normal views exclude archived and spam
    if (archivedIds.has(t.id) || spamIds.has(t.id)) return false;
    if (activeView === 'My Tickets') return t.assignee === CURRENT_USER;
    if (activeView === 'Unassigned') return t.assignee === 'Unassigned';
    return true;
  }), [activeView, archivedIds, spamIds]);

  // Counts per tab — use effective status
  const counts = useMemo(() => ({
    All: viewTickets.length,
    Open: viewTickets.filter((t) => effectiveStatus(t) === 'open').length,
    Closed: viewTickets.filter((t) => effectiveStatus(t) === 'closed').length,
  }), [viewTickets, statusOverrides]);

  const filtered = useMemo(() => viewTickets.filter((t) => {
    const status = effectiveStatus(t);

    // Tab filter
    if (tab === 'Open' && status !== 'open') return false;
    if (tab === 'Closed' && status !== 'closed') return false;

    // Status filter panel
    const statusFilter = filters.status ?? [];
    if (statusFilter.length > 0) {
      const wantOpen = statusFilter.includes('Open');
      const wantClosed = statusFilter.includes('Closed');
      if (wantOpen && !wantClosed && status !== 'open') return false;
      if (wantClosed && !wantOpen && status !== 'closed') return false;
    }

    // Priority filter
    const priorityFilter = filters.priority ?? [];
    if (priorityFilter.length > 0) {
      const wantHigh = priorityFilter.includes('High');
      const wantLow = priorityFilter.includes('Low');
      if (wantHigh && !wantLow && t.priority !== 'high') return false;
      if (wantLow && !wantHigh && t.priority !== 'normal') return false;
    }

    // Type filter
    const typeFilter = filters.type ?? [];
    if (typeFilter.length > 0 && !typeFilter.includes(t.category)) return false;

    // Assignee filter
    const assigneeFilter = filters.assignee ?? [];
    if (assigneeFilter.length > 0) {
      const matchesAssigned = assigneeFilter.includes('Assigned to me') && t.assignee === CURRENT_USER;
      const matchesUnassigned = assigneeFilter.includes('Unassigned') && t.assignee === 'Unassigned';
      const matchesNamed = assigneeFilter.some((a) =>
        a !== 'Assigned to me' && a !== 'Unassigned' && t.assignee === a
      );
      if (!matchesAssigned && !matchesUnassigned && !matchesNamed) return false;
    }

    // Search
    if (
      search &&
      !t.subject.toLowerCase().includes(search.toLowerCase()) &&
      !t.customer.name.toLowerCase().includes(search.toLowerCase())
    )
      return false;

    return true;
  }), [viewTickets, tab, filters, search, statusOverrides]);

  useEffect(() => {
    onFilteredChange?.(filtered);
  }, [filtered]);

  return (
    <div className={cn('flex flex-col h-full border-r border-[#e5e7eb] bg-[#fafafa]', narrow ? 'w-[300px] shrink-0' : 'flex-1 min-w-0')}>
      {/* Header */}
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3 border-b border-[#e5e7eb] shrink-0">
        {/* Row 1: Title + Tabs (wide) */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-[#18181b]">{getViewTitle(activeView)}</h2>
          {!narrow && !VIEWS_WITHOUT_TABS.includes(activeView) && (
            <div className="flex items-center rounded-md border border-[#e5e7eb] overflow-hidden bg-[#f4f4f5]">
              {(['All', 'Open', 'Closed'] as TabFilter[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 h-6 text-sm font-medium transition-colors',
                    tab === t ? 'bg-white text-[#18181b]' : 'text-[#71717a] hover:text-[#18181b]'
                  )}
                >
                  {t}
                  <span className={cn(
                    'text-[10px] font-semibold tabular-nums',
                    tab === t ? 'text-[#71717a]' : 'text-[#a1a1aa]'
                  )}>
                    {counts[t]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Row 2: Search + Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
            <Input
              placeholder="Type to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm bg-white border-[#e5e7eb] focus-visible:border-[#a1a1aa] rounded-md"
            />
          </div>
          <FilterButton filters={filters} onChange={setFilters} />
        </div>

        {/* Row 3: Tabs (narrow — below search) */}
        {narrow && !VIEWS_WITHOUT_TABS.includes(activeView) && (
          <div className="flex items-center rounded-md border border-[#e5e7eb] overflow-hidden bg-[#f4f4f5]">
            {(['All', 'Open', 'Closed'] as TabFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex items-center justify-center gap-1.5 flex-1 h-6 text-sm font-medium transition-colors',
                  tab === t ? 'bg-white text-[#18181b]' : 'text-[#71717a] hover:text-[#18181b]'
                )}
              >
                {t}
                <span className={cn(
                  'text-[10px] font-semibold tabular-nums',
                  tab === t ? 'text-[#71717a]' : 'text-[#a1a1aa]'
                )}>
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ticket rows */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[#71717a]">No tickets found</div>
        ) : (
          filtered.map((ticket) =>
            narrow ? (
              <NarrowTicketRow
                key={ticket.id}
                ticket={ticket}
                isSelected={ticket.id === selectedId}
                onSelect={() => onSelect(ticket)}
              />
            ) : (
              <WideTicketRow
                key={ticket.id}
                ticket={ticket}
                isSelected={ticket.id === selectedId}
                onSelect={() => onSelect(ticket)}
                onArchive={() => onArchive(ticket.id)}
                effectiveStatus={effectiveStatus(ticket)}
                isArchived={archivedIds.has(ticket.id)}
                isSpam={spamIds.has(ticket.id)}
              />
            )
          )
        )}
      </div>
    </div>
  );
}
