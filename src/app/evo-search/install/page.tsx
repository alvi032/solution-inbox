'use client';

import { useRouter } from 'next/navigation';
import AppSidebar from '@/components/app-sidebar';
import {
  Star,
  CheckCircle2,
  ArrowLeft,
  Zap,
  BarChart2,
  Sliders,
  Globe,
} from 'lucide-react';

const screenshots = [
  {
    label: 'Search Widget',
    bg: '#f0fdf4',
    accent: '#16a34a',
    content: (
      <div className="p-4 space-y-2">
        <div className="h-8 bg-white rounded-lg border border-[#e5e7eb] flex items-center px-3 gap-2">
          <div className="w-4 h-4 rounded bg-[#d1fae5]" />
          <div className="h-2 w-32 rounded bg-[#d1fae5]" />
        </div>
        {['Leather Bag', 'Denim Jacket', 'Rain Boots'].map((item) => (
          <div key={item} className="h-10 bg-white rounded-lg border border-[#e5e7eb] flex items-center px-3 gap-3">
            <div className="w-7 h-7 rounded bg-[#d1fae5] shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="h-2 w-24 rounded bg-[#bbf7d0]" />
              <div className="h-2 w-16 rounded bg-[#d1fae5]" />
            </div>
            <div className="h-2 w-10 rounded bg-[#86efac]" />
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Analytics',
    bg: '#faf5ff',
    accent: '#8b5cf6',
    content: (
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {['8,341', '18.4%', '$12,458', '2.3'].map((v) => (
            <div key={v} className="bg-white rounded-lg border border-[#e5e7eb] p-2">
              <div className="h-2 w-16 rounded bg-[#ede9fe] mb-1" />
              <div className="text-sm font-bold text-[#7c3aed]">{v}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-[#e5e7eb] p-3">
          <div className="h-2 w-24 rounded bg-[#ede9fe] mb-3" />
          <svg viewBox="0 0 160 50" className="w-full">
            <polyline points="0,40 32,28 64,18 96,35 128,22 160,24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
            {[0,32,64,96,128,160].map((x,i) => {
              const ys = [40,28,18,35,22,24];
              return <circle key={i} cx={x} cy={ys[i]} r="3" fill="#8b5cf6" />;
            })}
          </svg>
        </div>
      </div>
    ),
  },
  {
    label: 'Widget Customization',
    bg: '#fff7ed',
    accent: '#ea580c',
    content: (
      <div className="p-4 space-y-2">
        {[['Font Family', 'Inter'], ['Corner Radius', '10px'], ['Background', '#FFFFFF'], ['Title Color', '#303030'], ['Icon Color', '#EA580C']].map(([label, val]) => (
          <div key={label} className="bg-white rounded-lg border border-[#e5e7eb] flex items-center justify-between px-3 py-2">
            <div className="h-2 w-20 rounded bg-[#fed7aa]" />
            <div className="text-[10px] font-medium text-[#ea580c]">{val}</div>
          </div>
        ))}
      </div>
    ),
  },
];

const features = [
  { icon: Zap, title: 'Instant results', desc: 'Sub-100ms search powered by vector embeddings' },
  { icon: BarChart2, title: 'Built-in analytics', desc: 'Track top queries, no-result searches, and conversion' },
  { icon: Sliders, title: 'Full customization', desc: 'Match your brand with fonts, colors, and corner radius' },
  { icon: Globe, title: 'Multi-region', desc: 'Deploy to any geography with configurable rollout' },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['Up to 1,000 searches/mo', 'Basic analytics', 'Default widget UI', 'Email support'],
    cta: 'Install free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'per month',
    features: ['Unlimited searches', 'Full analytics suite', 'Widget customization', 'Priority support', 'Multi-region rollout', 'Custom CSS'],
    cta: 'Start free trial',
    highlighted: true,
  },
];

const reviews = [
  { author: 'Marcus T.', role: 'Head of E-commerce', rating: 5, text: 'Evo Search cut our no-result rate by 60% in the first week. The analytics alone are worth it.' },
  { author: 'Priya S.', role: 'Product Manager', rating: 5, text: 'Setup took under 10 minutes. The widget customization is incredibly deep without being overwhelming.' },
  { author: 'Daniel R.', role: 'CTO', rating: 4, text: 'Solid search infrastructure. Would love more export options in analytics, but overall very happy.' },
];

export default function EvoSearchInstallPage() {
  const router = useRouter();

  const handleInstall = () => {
    localStorage.setItem('evoSearchInstalled', 'true');
    window.dispatchEvent(new Event('evo-search-installed'));
    router.push('/evo-search/analytics');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto bg-[#f6f6f7]">
        {/* Back nav */}
        <div className="sticky top-0 z-10 bg-[#f6f6f7]/90 backdrop-blur border-b border-[#e5e7eb] px-8 py-3 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-[#71717a] hover:text-[#18181b] transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">

          {/* Hero */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#faf5ff] flex items-center justify-center text-4xl shrink-0 border border-[#ede9fe]">
                🔍
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold text-[#18181b]">Evo Search</h1>
                    <p className="text-sm text-[#71717a] mt-0.5">by Evo AI · Search & Discovery</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-[#f59e0b] text-[#f59e0b]" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-[#18181b]">4.9</span>
                      <span className="text-sm text-[#71717a]">· 214 reviews</span>
                      <span className="text-sm text-[#71717a]">· 1,200+ installs</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={handleInstall}
                      className="h-10 px-6 rounded-xl bg-[#18181b] text-white text-sm font-semibold hover:bg-[#27272a] transition-colors"
                    >
                      Install app
                    </button>
                    <span className="text-xs text-[#71717a]">Free plan available</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {['Semantic Search', 'Vector Embeddings', 'Analytics', 'Customizable Widget'].map((tag) => (
                    <span key={tag} className="text-xs font-medium text-[#7c3aed] bg-[#f5f3ff] rounded-full px-2.5 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <h2 className="text-base font-semibold text-[#18181b] mb-3">Preview</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {screenshots.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-[#e5e7eb] overflow-hidden shrink-0 w-64 bg-white"
                >
                  <div className="h-48 overflow-hidden" style={{ backgroundColor: s.bg }}>
                    {s.content}
                  </div>
                  <div className="px-3 py-2 border-t border-[#e5e7eb]">
                    <p className="text-xs font-medium text-[#3f3f46]">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About + Features */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl border border-[#e5e7eb] p-6">
              <h2 className="text-base font-semibold text-[#18181b] mb-3">About</h2>
              <p className="text-sm text-[#3f3f46] leading-relaxed">
                Evo Search brings semantic, vector-powered search to your workspace. Unlike keyword matching, Evo Search understands intent — surfacing the right results even when queries are vague or misspelled. Pair it with the built-in analytics dashboard to understand exactly what your users are searching for and where they're dropping off.
              </p>
              <p className="text-sm text-[#3f3f46] leading-relaxed mt-3">
                The fully customizable widget lets you match your brand in minutes, and the geographic rollout controls let you ship to specific regions with configurable traffic percentages.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
              <h2 className="text-base font-semibold text-[#18181b] mb-3">Details</h2>
              <dl className="space-y-3">
                {[
                  ['Developer', 'Evo AI'],
                  ['Category', 'Search'],
                  ['Version', '2.4.1'],
                  ['Updated', 'Apr 10, 2026'],
                  ['Languages', 'English, French, Spanish'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] font-medium text-[#71717a] uppercase tracking-wide">{k}</dt>
                    <dd className="text-sm text-[#18181b] mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Key features */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
            <h2 className="text-base font-semibold text-[#18181b] mb-4">Key features</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f5f3ff] flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-[#7c3aed]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#18181b]">{title}</p>
                    <p className="text-xs text-[#71717a] mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-base font-semibold text-[#18181b] mb-3">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border p-6 flex flex-col gap-4 ${plan.highlighted ? 'border-[#18181b] bg-[#18181b] text-white' : 'border-[#e5e7eb] bg-white'}`}
                >
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${plan.highlighted ? 'text-[#a1a1aa]' : 'text-[#71717a]'}`}>{plan.name}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className={`text-sm ${plan.highlighted ? 'text-[#a1a1aa]' : 'text-[#71717a]'}`}>/ {plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={14} className={plan.highlighted ? 'text-[#a1a1aa]' : 'text-[#16a34a]'} />
                        <span className={plan.highlighted ? 'text-[#d4d4d8]' : 'text-[#3f3f46]'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleInstall}
                    className={`w-full h-9 rounded-xl text-sm font-semibold transition-colors ${plan.highlighted ? 'bg-white text-[#18181b] hover:bg-[#f4f4f5]' : 'bg-[#18181b] text-white hover:bg-[#27272a]'}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#18181b]">Reviews</h2>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#18181b]">4.9</span>
                <span className="text-sm text-[#71717a]">out of 5</span>
              </div>
            </div>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.author} className="border-t border-[#f4f4f5] pt-4 first:border-0 first:pt-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#f4f4f5] flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-[#3f3f46]">{r.author[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#18181b]">{r.author}</p>
                        <p className="text-xs text-[#71717a]">{r.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} size={12} className="fill-[#f59e0b] text-[#f59e0b]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#3f3f46] leading-relaxed mt-2">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-[#18181b] rounded-2xl p-8 flex items-center justify-between gap-6">
            <div>
              <p className="text-lg font-bold text-white">Ready to upgrade your search?</p>
              <p className="text-sm text-[#a1a1aa] mt-1">Install Evo Search in under 5 minutes. No credit card required.</p>
            </div>
            <button
              onClick={handleInstall}
              className="h-10 px-6 rounded-xl bg-white text-[#18181b] text-sm font-semibold hover:bg-[#f4f4f5] transition-colors shrink-0"
            >
              Install free
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
