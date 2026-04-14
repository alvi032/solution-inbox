'use client';

import { useState } from 'react';
import { Ticket } from '@/lib/data';
import Sidebar from '@/components/sidebar';
import TicketList from '@/components/ticket-list';
import ChatPanel from '@/components/chat-panel';
import DetailPanel from '@/components/detail-panel';

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeView, setActiveView] = useState('Inbox');
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [spamIds, setSpamIds] = useState<Set<string>>(new Set());
  // Tracks status overrides: 'closed' when resolved through UI, 'open' when reopened through UI
  const [statusOverrides, setStatusOverrides] = useState<Record<string, 'open' | 'closed'>>({});
  // Tracks which tickets were resolved through the UI (for showing the "resolved" banner)
  const [resolvedBannerIds, setResolvedBannerIds] = useState<Set<string>>(new Set());

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSidebarCollapsed(true);
  };

  const handleCloseTicket = () => setSelectedTicket(null);

  // Archive
  const handleArchive = (id: string) => {
    setArchivedIds((prev) => new Set([...prev, id]));
    setSpamIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };
  const handleUnarchive = (id: string) => {
    setArchivedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  // Resolve → moves ticket to Closed
  const handleResolve = (id: string) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: 'closed' }));
    setResolvedBannerIds((prev) => new Set([...prev, id]));
    setArchivedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    setSpamIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  // Reopen → works for both resolved tickets and originally-closed tickets
  const handleReopen = (id: string) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: 'open' }));
    setResolvedBannerIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  // Spam
  const handleMarkSpam = (id: string) => {
    setSpamIds((prev) => new Set([...prev, id]));
    setArchivedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };
  const handleUnmarkSpam = (id: string) => {
    setSpamIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  const effectiveStatus = (ticket: Ticket): 'open' | 'closed' =>
    statusOverrides[ticket.id] ?? ticket.status;

  const currentIndex = selectedTicket ? filteredTickets.findIndex((t) => t.id === selectedTicket.id) : -1;

  const handleNavigate = (dir: 'prev' | 'next') => {
    if (currentIndex === -1 || filteredTickets.length === 0) return;
    const nextIndex = dir === 'prev'
      ? (currentIndex - 1 + filteredTickets.length) % filteredTickets.length
      : (currentIndex + 1) % filteredTickets.length;
    setSelectedTicket(filteredTickets[nextIndex]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setSelectedTicket(null);
        }}
      />

      <TicketList
        selectedId={selectedTicket?.id ?? null}
        onSelect={handleSelectTicket}
        narrow={!!selectedTicket}
        activeView={activeView}
        archivedIds={archivedIds}
        spamIds={spamIds}
        statusOverrides={statusOverrides}
        onArchive={handleArchive}
        onFilteredChange={setFilteredTickets}
      />

      {selectedTicket && (
        <>
          <ChatPanel
            ticket={selectedTicket}
            onClose={handleCloseTicket}
            ticketIndex={currentIndex}
            ticketTotal={filteredTickets.length}
            onNavigate={handleNavigate}
            effectiveStatus={effectiveStatus(selectedTicket)}
            onReopen={() => handleReopen(selectedTicket.id)}
          />
          <DetailPanel
            ticket={selectedTicket}
            effectiveStatus={effectiveStatus(selectedTicket)}
            isArchived={archivedIds.has(selectedTicket.id)}
            showResolvedBanner={resolvedBannerIds.has(selectedTicket.id)}
            isSpam={spamIds.has(selectedTicket.id)}
            onArchive={() => handleArchive(selectedTicket.id)}
            onUnarchive={() => handleUnarchive(selectedTicket.id)}
            onResolve={() => handleResolve(selectedTicket.id)}
            onReopen={() => handleReopen(selectedTicket.id)}
            onMarkSpam={() => handleMarkSpam(selectedTicket.id)}
            onUnmarkSpam={() => handleUnmarkSpam(selectedTicket.id)}
          />
        </>
      )}
    </div>
  );
}
