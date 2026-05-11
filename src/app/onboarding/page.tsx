'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Search,
  Sparkles,
  ShoppingCart,
  Box,
  Globe,
  Check,
  ChevronRight,
  Loader2,
  ArrowRight,
  LayoutDashboard,
  Zap,
} from 'lucide-react';

type Goal = 'support' | 'evo-search' | 'quizzes';
type Platform = 'shopify' | 'woocommerce' | 'bigcommerce' | 'magento' | 'other';

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            i < current
              ? 'w-2 h-2 bg-[#18181b]'
              : i === current
              ? 'w-6 h-2 bg-[#18181b]'
              : 'w-2 h-2 bg-[#d4d4d8]'
          )}
        />
      ))}
    </div>
  );
}

// ─── Step 1: Choose goal ──────────────────────────────────────────────────────

function StepGoal({ onSelect }: { onSelect: (g: Goal) => void }) {
  const goals = [
    {
      id: 'support' as Goal,
      heading: 'Reduce Support Tickets',
      tag: 'Support Agent',
      description: 'AI agents that resolve customer questions instantly.',
      icon: <MessageSquare size={22} className="text-[#18181b]" />,
      comingSoon: false,
    },
    {
      id: 'evo-search' as Goal,
      heading: 'Improve Product Discovery',
      tag: 'Evo Search',
      description: 'AI search that helps shoppers find what they need.',
      icon: <Search size={22} className="text-[#18181b]" />,
      comingSoon: false,
    },
    {
      id: 'quizzes' as Goal,
      heading: 'Personalized Shopping Experience',
      tag: 'Quizzes',
      description: 'Quizzes that recommend the right product for every shopper.',
      icon: <Sparkles size={22} className="text-[#a1a1aa]" />,
      comingSoon: true,
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-semibold text-[#71717a] uppercase tracking-widest mb-3">Step 1 of 4</p>
      <h1 className="text-2xl font-semibold text-[#18181b] mb-2">Choose your goal</h1>
      <p className="text-sm text-[#71717a] mb-10">What would you like to improve today?</p>

      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => !g.comingSoon && onSelect(g.id)}
            disabled={g.comingSoon}
            className={cn(
              'relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all',
              g.comingSoon
                ? 'border-[#e4e4e7] bg-[#fafafa] opacity-50 cursor-not-allowed'
                : 'border-[#e4e4e7] bg-white hover:border-[#18181b] hover:shadow-md cursor-pointer'
            )}
          >
            {g.comingSoon && (
              <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider text-[#a1a1aa] bg-[#f4f4f5] px-1.5 py-0.5 rounded-full">
                Coming soon
              </span>
            )}
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              g.comingSoon ? 'bg-[#f4f4f5]' : 'bg-[#f4f4f5]'
            )}>
              {g.icon}
            </div>
            <div>
              <span className={cn(
                'inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2',
                g.comingSoon ? 'bg-[#f4f4f5] text-[#a1a1aa]' : 'bg-[#18181b] text-white'
              )}>
                {g.tag}
              </span>
              <p className={cn('text-sm font-semibold leading-snug', g.comingSoon ? 'text-[#a1a1aa]' : 'text-[#18181b]')}>
                {g.heading}
              </p>
              <p className="text-xs text-[#71717a] mt-1 leading-relaxed">{g.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Connect store ────────────────────────────────────────────────────

function StepPlatform({ onSelect }: { onSelect: (p: Platform) => void }) {
  const platforms = [
    { id: 'shopify' as Platform,     name: 'Shopify',      logo: '🛍️' },
    { id: 'woocommerce' as Platform, name: 'WooCommerce',  logo: '🔌' },
    { id: 'bigcommerce' as Platform, name: 'BigCommerce',  logo: '🏪' },
    { id: 'magento' as Platform,     name: 'Magento',      logo: '🧲' },
    { id: 'other' as Platform,       name: 'Other Platform', logo: '🔗', sub: 'Connect via API' },
  ];

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-semibold text-[#71717a] uppercase tracking-widest mb-3">Step 2 of 4</p>
      <h1 className="text-2xl font-semibold text-[#18181b] mb-2">Connect your store</h1>
      <p className="text-sm text-[#71717a] mb-10">Select your e-commerce platform to get started.</p>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xl">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#e4e4e7] bg-white px-4 py-5 hover:border-[#18181b] hover:shadow-md transition-all cursor-pointer"
          >
            <span className="text-3xl">{p.logo}</span>
            <span className="text-sm font-semibold text-[#18181b]">{p.name}</span>
            {p.sub && <span className="text-[10px] text-[#a1a1aa]">{p.sub}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3a: Support Agent — connect channels ────────────────────────────────

function StepSupportChannels({ onContinue }: { onContinue: () => void }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    'live-chat': false,
    email: false,
    messenger: false,
    whatsapp: false,
    instagram: false,
  });

  const channels = [
    { id: 'live-chat',  name: 'Live Chat',  icon: '💬' },
    { id: 'email',      name: 'Email',      icon: '✉️' },
    { id: 'messenger',  name: 'Messenger',  icon: '📨' },
    { id: 'whatsapp',   name: 'WhatsApp',   icon: '📱' },
    { id: 'instagram',  name: 'Instagram',  icon: '📸' },
  ];

  const toggle = (id: string) => setEnabled(prev => ({ ...prev, [id]: !prev[id] }));
  const anyEnabled = Object.values(enabled).some(Boolean);

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-semibold text-[#71717a] uppercase tracking-widest mb-3">Step 3 of 4</p>
      <h1 className="text-2xl font-semibold text-[#18181b] mb-2">Support Agent Setup</h1>
      <p className="text-sm text-[#71717a] mb-10">Connect the channels where your customers reach you.</p>

      <div className="w-full max-w-sm flex flex-col gap-2 mb-10">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="flex items-center justify-between rounded-xl border border-[#e4e4e7] bg-white px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{ch.icon}</span>
              <span className="text-sm font-medium text-[#18181b]">{ch.name}</span>
            </div>
            <button
              onClick={() => toggle(ch.id)}
              className={cn(
                'relative w-10 h-5 rounded-full transition-colors shrink-0',
                enabled[ch.id] ? 'bg-[#18181b]' : 'bg-[#d4d4d8]'
              )}
            >
              <span className={cn(
                'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                enabled[ch.id] && 'translate-x-5'
              )} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="flex items-center gap-2 h-10 px-6 rounded-xl bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors"
      >
        Continue
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ─── Step 3b: Evo Search — sync catalog ──────────────────────────────────────

const SYNC_STEPS = [
  'Fetching products',
  'Processing data',
  'Building search index',
  'Automating search results',
];

function StepEvoSync({ onContinue }: { onContinue: () => void }) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(-1);
  const [done, setDone] = useState(false);

  const startSync = () => {
    setStarted(true);
    setCurrent(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= SYNC_STEPS.length) {
        clearInterval(interval);
        setCurrent(SYNC_STEPS.length);
        setDone(true);
      } else {
        setCurrent(step);
      }
    }, 1400);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-semibold text-[#71717a] uppercase tracking-widest mb-3">Step 3 of 4</p>
      <h1 className="text-2xl font-semibold text-[#18181b] mb-2">Sync your catalog</h1>
      <p className="text-sm text-[#71717a] mb-10">We'll index your products to power smart search.</p>

      <div className="w-full max-w-sm flex flex-col gap-2 mb-8">
        {SYNC_STEPS.map((label, i) => {
          const isActive  = started && current === i;
          const isComplete = started && current > i;
          return (
            <div
              key={label}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3 transition-all',
                isComplete ? 'border-[#18181b] bg-[#f4f4f5]' :
                isActive   ? 'border-[#18181b] bg-white shadow-sm' :
                             'border-[#e4e4e7] bg-white opacity-50'
              )}
            >
              <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                {isComplete ? (
                  <Check size={14} className="text-[#18181b]" strokeWidth={2.5} />
                ) : isActive ? (
                  <Loader2 size={14} className="text-[#18181b] animate-spin" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4d4d8]" />
                )}
              </div>
              <span className={cn(
                'text-sm',
                isComplete || isActive ? 'text-[#18181b] font-medium' : 'text-[#a1a1aa]'
              )}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {!started && (
          <button
            onClick={startSync}
            className="flex items-center gap-2 h-10 px-6 rounded-xl bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors"
          >
            Start indexing
            <Zap size={14} />
          </button>
        )}
        {done && (
          <button
            onClick={onContinue}
            className="flex items-center gap-2 h-10 px-6 rounded-xl bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors"
          >
            Continue
            <ChevronRight size={15} />
          </button>
        )}
        <button
          onClick={onContinue}
          className="h-10 px-4 text-sm text-[#71717a] hover:text-[#18181b] transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: All set ──────────────────────────────────────────────────────────

function StepDone({ goal }: { goal: Goal }) {
  const router = useRouter();

  const upsells = goal === 'support'
    ? [
        { icon: <Search size={18} />,    title: 'Add Evo Search',   desc: 'AI-powered product discovery for your store.' },
        { icon: <Sparkles size={18} />,  title: 'Add Quizzes',      desc: 'Personalized product recommendations.' },
        { icon: <Zap size={18} />,       title: 'Upgrade to Pro',   desc: 'Unlock advanced analytics and priority support.' },
      ]
    : [
        { icon: <MessageSquare size={18} />, title: 'Add Support Agent', desc: 'AI agents that resolve customer tickets instantly.' },
        { icon: <Sparkles size={18} />,      title: 'Add Quizzes',       desc: 'Personalized product recommendations.' },
        { icon: <Zap size={18} />,           title: 'Upgrade to Pro',    desc: 'Unlock advanced analytics and priority support.' },
      ];

  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-5">
        <Check size={24} className="text-[#16a34a]" strokeWidth={2.5} />
      </div>
      <p className="text-xs font-semibold text-[#71717a] uppercase tracking-widest mb-3">Step 4 of 4</p>
      <h1 className="text-2xl font-semibold text-[#18181b] mb-2">You're all set!</h1>
      <p className="text-sm text-[#71717a] mb-8">Your setup is complete. Head to the dashboard to see it in action.</p>

      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-2 h-10 px-6 rounded-xl bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors mb-12"
      >
        <LayoutDashboard size={15} />
        Go to Dashboard
      </button>

      {/* Upsell section */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[#e4e4e7]" />
          <p className="text-xs font-semibold text-[#71717a] uppercase tracking-widest whitespace-nowrap">
            Unlock more with Evo AI
          </p>
          <div className="flex-1 h-px bg-[#e4e4e7]" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {upsells.map((u) => (
            <button
              key={u.title}
              className="flex flex-col items-start gap-3 rounded-2xl border border-[#e4e4e7] bg-white p-5 text-left hover:border-[#18181b] hover:shadow-md transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center text-[#18181b]">
                {u.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#18181b]">{u.title}</p>
                <p className="text-xs text-[#71717a] mt-0.5 leading-relaxed">{u.desc}</p>
              </div>
              <span className="text-xs font-medium text-[#18181b] flex items-center gap-1 mt-auto">
                Get started <ArrowRight size={11} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main onboarding page ─────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);

  const handleGoal = (g: Goal) => { setGoal(g); setStep(1); };
  const handlePlatform = () => setStep(2);
  const handleAppSetup = () => setStep(3);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-8 border-b border-[#e5e7eb] bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#18181b] flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-[#18181b]">Evo AI</span>
        </div>
        <StepIndicator current={step} total={4} />
        <div className="w-20" /> {/* spacer to center the indicator */}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center py-16 px-8">
        {step === 0 && <StepGoal onSelect={handleGoal} />}
        {step === 1 && <StepPlatform onSelect={handlePlatform} />}
        {step === 2 && goal === 'support'    && <StepSupportChannels onContinue={handleAppSetup} />}
        {step === 2 && goal === 'evo-search' && <StepEvoSync onContinue={handleAppSetup} />}
        {step === 3 && goal && <StepDone goal={goal} />}
      </div>
    </div>
  );
}
