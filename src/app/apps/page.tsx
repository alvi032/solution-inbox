'use client';

import { useState, useEffect } from 'react';
import AppSidebar from '@/components/app-sidebar';
import { CheckCircle2 } from 'lucide-react';

const baseApps = [
  {
    name: 'Sales Agent',
    description: 'AI-powered sales assistant that qualifies leads, drafts outreach, and tracks pipeline activity automatically.',
    icon: '💼',
    iconBg: '#eff6ff',
    installed: true,
    category: 'Sales',
  },
  {
    name: 'Support Agent',
    description: 'Intelligent support inbox that triages tickets, suggests replies, and resolves common issues without human intervention.',
    icon: '🎧',
    iconBg: '#f0fdf4',
    installed: true,
    category: 'Support',
  },
  {
    name: 'Evo Search',
    description: 'Semantic search across your knowledge base, docs, and customer history — powered by vector embeddings.',
    icon: '🔍',
    iconBg: '#faf5ff',
    installed: false,
    category: 'Search',
  },
  {
    name: 'Quizzes',
    description: 'Create interactive product quizzes to guide customers to the right purchase and capture zero-party data.',
    icon: '🧩',
    iconBg: '#fffbeb',
    installed: false,
    category: 'Engagement',
  },
];

export default function AppsPage() {
  const [evoSearchInstalled, setEvoSearchInstalled] = useState(false);

  useEffect(() => {
    setEvoSearchInstalled(localStorage.getItem('evoSearchInstalled') === 'true');
  }, []);

  const apps = baseApps.map((a) =>
    a.name === 'Evo Search' ? { ...a, installed: evoSearchInstalled } : a
  );

  const handleInstallEvoSearch = () => {
    localStorage.setItem('evoSearchInstalled', 'true');
    setEvoSearchInstalled(true);
    window.dispatchEvent(new Event('evo-search-installed'));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-[#18181b]">Apps and Plugins</h1>
            <p className="text-sm text-[#71717a] mt-0.5">Extend your workspace with powerful integrations.</p>
          </div>

          <div className="mb-6">
            <p className="text-xs font-medium text-[#71717a] uppercase tracking-wide mb-3">
              Installed · {apps.filter((a) => a.installed).length}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {apps.filter((a) => a.installed).map((app) => (
                <AppCard key={app.name} app={app} onInstall={handleInstallEvoSearch} />
              ))}
            </div>
          </div>

          {apps.some((a) => !a.installed) && (
            <>
              <div className="border-t border-[#e5e7eb] mb-6" />
              <div>
                <p className="text-xs font-medium text-[#71717a] uppercase tracking-wide mb-3">
                  Available · {apps.filter((a) => !a.installed).length}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {apps.filter((a) => !a.installed).map((app) => (
                    <AppCard key={app.name} app={app} onInstall={handleInstallEvoSearch} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function AppCard({
  app,
  onInstall,
}: {
  app: (typeof baseApps)[number] & { installed: boolean };
  onInstall: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ backgroundColor: app.iconBg }}
          >
            {app.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#18181b]">{app.name}</p>
            <span className="text-[11px] text-[#71717a]">{app.category}</span>
          </div>
        </div>
        {app.installed && (
          <span className="flex items-center gap-1 text-xs font-medium text-[#16a34a] bg-[#dcfce7] rounded-full px-2.5 py-1 shrink-0">
            <CheckCircle2 size={12} />
            Installed
          </span>
        )}
      </div>

      <p className="text-sm text-[#71717a] leading-relaxed">{app.description}</p>

      <div className="mt-auto">
        {app.installed ? (
          <button className="text-sm font-medium text-[#3f3f46] hover:text-[#18181b] transition-colors">
            Manage →
          </button>
        ) : (
          <button
            onClick={app.name === 'Evo Search' ? onInstall : undefined}
            className="h-8 px-4 rounded-md bg-[#18181b] text-[#fafafa] text-sm font-medium hover:bg-[#27272a] transition-colors"
          >
            Install
          </button>
        )}
      </div>
    </div>
  );
}
