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
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSidebarCollapsed(true);
  };

  const handleCloseTicket = () => {
    setSelectedTicket(null);
  };

  const handleArchive = (id: string) => {
    setArchivedIds((prev) => new Set([...prev, id]));
    if (selectedTicket?.id === id) {
      setSelectedTicket(null);
    }
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
        onArchive={handleArchive}
      />

      {selectedTicket && (
        <>
          <ChatPanel ticket={selectedTicket} onClose={handleCloseTicket} />
          <DetailPanel
            ticket={selectedTicket}
            onResolve={handleCloseTicket}
            onArchive={() => handleArchive(selectedTicket.id)}
          />
        </>
      )}
    </div>
  );
}
