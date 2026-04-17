'use client';

import { useRouter } from 'next/navigation';
import AppSidebar from '@/components/app-sidebar';
import {
  Star,
  CheckCircle2,
  ArrowLeft,
  MousePointerClick,
  Users,
  BarChart2,
  Palette,
} from 'lucide-react';

const screenshots = [
  {
    label: 'Quiz Builder',
    bg: '#fffbeb',
    content: (
      <div className="p-4 space-y-2">
        <div className="bg-white rounded-lg border border-[#e5e7eb] p-3">
          <div className="h-2 w-32 rounded bg-[#fde68a] mb-2" />
          <div className="space-y-1.5">
            {['Option A', 'Option B', 'Option C'].map((o, i) => (
              <div key={o} className={`h-8 rounded-lg border flex items-center px-3 gap-2 ${i === 0 ? 'border-[#f59e0b] bg-[#fffbeb]' : 'border-[#e5e7eb] bg-white'}`}>
                <div className={`w-3 h-3 rounded-full border-2 ${i === 0 ? 'border-[#f59e0b] bg-[#f59e0b]' : 'border-[#d1d5db]'}`} />
                <div className="h-2 w-20 rounded bg-[#fde68a]" />
              </div>
            ))}
          </div>
        </div>
        <div className="h-8 rounded-lg bg-[#f59e0b] flex items-center justify-center">
          <div className="h-2 w-16 rounded bg-white/70" />
        </div>
      </div>
    ),
  },
  {
    label: 'Product Recommendations',
    bg: '#f0fdf4',
    content: (
      <div className="p-4 space-y-2">
        <div className="h-2 w-28 rounded bg-[#bbf7d0] mb-3" />
        {[['Leather Weekender', '$89'], ['Crossbody Bag', '$55'], ['Tote Classic', '$45']].map(([name, price]) => (
          <div key={name} className="bg-white rounded-lg border border-[#e5e7eb] flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded bg-[#d1fae5] shrink-0" />
            <div className="flex-1">
              <div className="h-2 w-24 rounded bg-[#bbf7d0]" />
            </div>
            <span className="text-[10px] font-bold text-[#16a34a]">{price}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Analytics',
    bg: '#eff6ff',
    content: (
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[['3,241', 'Responses'], ['68%', 'Completion'], ['$8,320', 'Revenue'], ['4.2%', 'CTR']].map(([v, l]) => (
            <div key={l} className="bg-white rounded-lg border border-[#e5e7eb] p-2">
              <div className="h-2 w-12 rounded bg-[#bfdbfe] mb-1" />
              <div className="text-sm font-bold text-[#2563eb]">{v}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-[#e5e7eb] p-3">
          <div className="h-2 w-20 rounded bg-[#bfdbfe] mb-2" />
          <div className="flex items-end gap-1 h-12">
            {[60, 80, 45, 90, 70, 85, 50].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: '#3b82f6', opacity: 0.3 + i * 0.1 }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

const features = [
  { icon: MousePointerClick, title: 'No-code builder', desc: 'Build interactive quizzes with drag-and-drop, no engineering required' },
  { icon: Users, title: 'Zero-party data', desc: 'Collect rich customer preferences directly and with consent' },
  { icon: BarChart2, title: 'Conversion analytics', desc: 'Track completions, drop-offs, and revenue attributed to quizzes' },
  { icon: Palette, title: 'Brand theming', desc: 'Match your brand colors, fonts, and logo across all quiz touchpoints' },
];

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    features: ['Up to 500 responses/mo', '1 active quiz', 'Basic analytics', 'Email support'],
    cta: 'Install free',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$39',
    period: 'per month',
    features: ['Unlimited responses', 'Unlimited quizzes', 'Full analytics', 'Product recommendations', 'Brand theming', 'Priority support'],
    cta: 'Start free trial',
    highlighted: true,
  },
];

const reviews = [
  { author: 'Sophie L.', role: 'Marketing Director', rating: 5, text: 'Our quiz converts 3× better than our standard product pages. The recommendation engine is genuinely smart.' },
  { author: 'James K.', role: 'E-commerce Manager', rating: 5, text: 'Setup was dead simple. We had our first quiz live in an afternoon and saw results within days.' },
  { author: 'Rina M.', role: 'Growth Lead', rating: 4, text: 'Great zero-party data collection. Would love Klaviyo integration out of the box, but the workaround is easy enough.' },
];

export default function QuizzesInstallPage() {
  const router = useRouter();

  const handleInstall = () => {
    localStorage.setItem('quizzesInstalled', 'true');
    window.dispatchEvent(new Event('quizzes-installed'));
    router.push('/quizzes');
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
              <div className="w-20 h-20 rounded-2xl bg-[#fffbeb] flex items-center justify-center text-4xl shrink-0 border border-[#fde68a]">
                🧩
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold text-[#18181b]">Quizzes</h1>
                    <p className="text-sm text-[#71717a] mt-0.5">by Evo AI · Engagement & Personalization</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-[#f59e0b] text-[#f59e0b]" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-[#18181b]">4.8</span>
                      <span className="text-sm text-[#71717a]">· 89 reviews</span>
                      <span className="text-sm text-[#71717a]">· 400+ installs</span>
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
                  {['Zero-party Data', 'Product Quizzes', 'Recommendations', 'Conversion'].map((tag) => (
                    <span key={tag} className="text-xs font-medium text-[#d97706] bg-[#fffbeb] rounded-full px-2.5 py-1">
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
                <div key={s.label} className="rounded-xl border border-[#e5e7eb] overflow-hidden shrink-0 w-64 bg-white">
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

          {/* About + Details */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl border border-[#e5e7eb] p-6">
              <h2 className="text-base font-semibold text-[#18181b] mb-3">About</h2>
              <p className="text-sm text-[#3f3f46] leading-relaxed">
                Quizzes helps you turn browsers into buyers by guiding them to the perfect product through engaging, conversational quizzes. Unlike generic recommendation engines, Quizzes collects zero-party data — preferences volunteered directly by the customer — so your recommendations are both accurate and privacy-compliant.
              </p>
              <p className="text-sm text-[#3f3f46] leading-relaxed mt-3">
                Build unlimited quizzes with the no-code editor, theme them to your brand, and use the analytics dashboard to understand exactly where customers drop off and which paths drive the most revenue.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
              <h2 className="text-base font-semibold text-[#18181b] mb-3">Details</h2>
              <dl className="space-y-3">
                {[
                  ['Developer', 'Evo AI'],
                  ['Category', 'Engagement'],
                  ['Version', '1.8.0'],
                  ['Updated', 'Apr 2, 2026'],
                  ['Languages', 'English, Spanish'],
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
                  <div className="w-8 h-8 rounded-lg bg-[#fffbeb] flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-[#d97706]" />
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
                <span className="text-sm font-semibold text-[#18181b]">4.8</span>
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
              <p className="text-lg font-bold text-white">Turn every visitor into a buyer.</p>
              <p className="text-sm text-[#a1a1aa] mt-1">Install Quizzes free. No credit card required.</p>
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
