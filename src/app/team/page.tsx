'use client';

import { useState } from 'react';
import AppSidebar from '@/components/app-sidebar';
import {
  Bot, Users, ChevronDown, ChevronUp, Check, Plus, Shield, ShieldCheck, Trash2, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Constants ───────────────────────────────────────────────────────

type MemberRole = 'super_admin' | 'admin' | 'agent';
type AgentType = 'ai' | 'human';

const APPS = [
  { id: 'support_inbox', label: 'Support Inbox', description: 'Manage support tickets and conversations' },
  { id: 'sales_agent', label: 'Sales Agent', description: 'Pre-purchase chatbot and sales flows' },
  { id: 'evo_search', label: 'Evo Search', description: 'AI-powered product and knowledge search' },
];

const PERMISSIONS = [
  { id: 'approve_workflows', label: 'Approve workflows', description: 'Review and publish workflow changes' },
  { id: 'customize_chatbot', label: 'Customize chatbot', description: 'Edit chatbot tone, persona, and responses' },
  { id: 'customize_widget', label: 'Customize widget', description: 'Modify the chat widget appearance and placement' },
  { id: 'manage_team', label: 'Manage team', description: 'Invite, remove, and configure team members' },
  { id: 'view_analytics', label: 'View analytics', description: 'Access dashboards and performance reports' },
  { id: 'manage_billing', label: 'Manage billing', description: 'Update subscription and payment details' },
  { id: 'export_data', label: 'Export data', description: 'Download conversations, reports, and logs' },
  { id: 'manage_integrations', label: 'Manage integrations', description: 'Connect and configure third-party tools' },
];

const ROLE_CONFIG: Record<MemberRole, { label: string; badge: string; description: string }> = {
  super_admin: {
    label: 'Super Admin',
    badge: 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]',
    description: 'Full access to all settings, billing, and team management',
  },
  admin: {
    label: 'Admin',
    badge: 'bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe]',
    description: 'Can manage workflows, agents, and view analytics',
  },
  agent: {
    label: 'Agent',
    badge: 'bg-[#f4f4f5] text-[#3f3f46] border-[#e4e4e7]',
    description: 'Access limited to assigned apps and permitted actions',
  },
};

const statusConfig = {
  active: { dot: 'bg-[#16a34a]', label: 'Active', text: 'text-[#16a34a]' },
  away: { dot: 'bg-[#d97706]', label: 'Away', text: 'text-[#d97706]' },
  offline: { dot: 'bg-[#a1a1aa]', label: 'Offline', text: 'text-[#71717a]' },
};

// ─── Types ────────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  name: string;
  type: AgentType;
  email?: string;
  memberRole: MemberRole;
  status: 'active' | 'away' | 'offline';
  permissions: string[];
  allowedApps: string[];
  isCurrentUser?: boolean;
}

// ─── Initial data ─────────────────────────────────────────────────────

const initialTeam: TeamMember[] = [
  {
    id: 'current-user',
    name: 'Alex R.',
    type: 'human',
    email: 'alex.r@example.com',
    memberRole: 'super_admin',
    status: 'active',
    permissions: PERMISSIONS.map(p => p.id),
    allowedApps: APPS.map(a => a.id),
    isCurrentUser: true,
  },
  {
    id: 'sarah-m',
    name: 'Sarah M.',
    type: 'human',
    email: 'sarah.m@example.com',
    memberRole: 'admin',
    status: 'active',
    permissions: ['approve_workflows', 'customize_chatbot', 'view_analytics'],
    allowedApps: ['support_inbox', 'sales_agent', 'evo_search'],
  },
  {
    id: 'james-t',
    name: 'James T.',
    type: 'human',
    email: 'james.t@example.com',
    memberRole: 'agent',
    status: 'away',
    permissions: ['view_analytics'],
    allowedApps: ['support_inbox'],
  },
  {
    id: 'priya-k',
    name: 'Priya K.',
    type: 'human',
    email: 'priya.k@example.com',
    memberRole: 'agent',
    status: 'active',
    permissions: [],
    allowedApps: ['support_inbox', 'sales_agent'],
  },
];

const AI_AGENTS = [
  { id: 'support-agent', name: 'Support Agent', description: 'AI · post-purchase support', status: 'active' as const },
  { id: 'sales-agent', name: 'Sales Agent', description: 'AI · pre-purchase conversions', status: 'active' as const },
];

// ─── Checkbox helper ──────────────────────────────────────────────────

function Checkbox({ checked, onChange, label, description }: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={onChange}
      className="flex items-start gap-3 w-full text-left group py-2.5 border-b border-[#f4f4f5] last:border-0"
    >
      <div className={cn(
        'w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors mt-0.5',
        checked ? 'bg-[#18181b] border-[#18181b]' : 'border-[#d4d4d8] group-hover:border-[#a1a1aa]'
      )}>
        {checked && <Check size={10} className="text-white" strokeWidth={3} />}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-[#18181b] leading-snug">{label}</p>
        {description && <p className="text-xs text-[#a1a1aa] mt-0.5">{description}</p>}
      </div>
    </button>
  );
}

// ─── Role selector ────────────────────────────────────────────────────

function RoleSelector({ value, onChange, disabled }: {
  value: MemberRole;
  onChange: (r: MemberRole) => void;
  disabled?: boolean;
}) {
  const roles: MemberRole[] = ['admin', 'agent'];
  return (
    <div className="flex gap-2">
      {roles.map(r => {
        const cfg = ROLE_CONFIG[r];
        const active = value === r;
        return (
          <button
            key={r}
            disabled={disabled}
            onClick={() => onChange(r)}
            className={cn(
              'flex-1 flex flex-col gap-0.5 rounded-xl border px-4 py-3 text-left transition-all',
              active
                ? 'border-[#18181b] bg-white shadow-sm'
                : 'border-[#e4e4e7] bg-[#fafafa] hover:border-[#a1a1aa]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                active ? 'border-[#18181b]' : 'border-[#d4d4d8]'
              )}>
                {active && <div className="w-2 h-2 rounded-full bg-[#18181b]" />}
              </div>
              <span className={cn('text-sm font-semibold', active ? 'text-[#18181b]' : 'text-[#71717a]')}>
                {cfg.label}
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] pl-6 leading-snug">{cfg.description}</p>
          </button>
        );
      })}
    </div>
  );
}

// ─── Invite modal ────────────────────────────────────────────────────

function InviteModal({ onClose, onInvite }: {
  onClose: () => void;
  onInvite: (name: string, email: string, role: MemberRole) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('agent');

  const valid = name.trim() && email.trim().includes('@');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-xl w-[440px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7]">
          <p className="text-sm font-semibold text-[#18181b]">Invite team member</p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f4f4f5] transition-colors text-[#71717a]">
            <X size={14} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-[#18181b] mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Jordan Lee"
              className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#18181b] transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#18181b] mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. jordan@example.com"
              className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#18181b] transition-colors"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-medium text-[#18181b] mb-1.5">Role</label>
            <RoleSelector value={role} onChange={setRole} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[#e4e4e7] bg-[#fafafa]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#71717a] hover:text-[#18181b] hover:border-[#a1a1aa] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => { onInvite(name.trim(), email.trim(), role); onClose(); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] disabled:opacity-40 transition-colors"
          >
            Send invite
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Member row ───────────────────────────────────────────────────────

function MemberRow({
  member,
  expanded,
  onToggle,
  onChange,
  onRemove,
  isSuperAdmin,
}: {
  member: TeamMember;
  expanded: boolean;
  onToggle: () => void;
  onChange: (updated: TeamMember) => void;
  onRemove: () => void;
  isSuperAdmin: boolean;
}) {
  const st = statusConfig[member.status];
  const roleCfg = ROLE_CONFIG[member.memberRole];
  const canEdit = isSuperAdmin && !member.isCurrentUser;

  const togglePermission = (id: string) => {
    const next = member.permissions.includes(id)
      ? member.permissions.filter(p => p !== id)
      : [...member.permissions, id];
    onChange({ ...member, permissions: next });
  };

  const toggleApp = (id: string) => {
    const next = member.allowedApps.includes(id)
      ? member.allowedApps.filter(a => a !== id)
      : [...member.allowedApps, id];
    onChange({ ...member, allowedApps: next });
  };

  return (
    <div className="border-b border-[#e5e7eb] last:border-0">
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#fafafa] transition-colors text-left"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-[#e0e7ff] flex items-center justify-center shrink-0">
          <Users size={16} className="text-[#4338ca]" />
        </div>

        {/* Name + email */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#18181b]">
              {member.name}
              {member.isCurrentUser && <span className="text-[#a1a1aa] font-normal ml-1">(you)</span>}
            </p>
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
            <span className={`text-xs ${st.text}`}>{st.label}</span>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-0.5">{member.email}</p>
        </div>

        {/* Role badge */}
        <div className="shrink-0">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-md border', roleCfg.badge)}>
            {roleCfg.label}
          </span>
        </div>

        {/* App pills */}
        <div className="hidden lg:flex items-center gap-1.5 w-[220px] shrink-0 flex-wrap">
          {member.allowedApps.length === APPS.length ? (
            <span className="text-xs text-[#71717a]">All apps</span>
          ) : member.allowedApps.length === 0 ? (
            <span className="text-xs text-[#a1a1aa] italic">No apps</span>
          ) : (
            member.allowedApps.map(id => (
              <span key={id} className="text-[11px] bg-[#f4f4f5] text-[#3f3f46] px-2 py-0.5 rounded-md border border-[#e4e4e7]">
                {APPS.find(a => a.id === id)?.label}
              </span>
            ))
          )}
        </div>

        {/* Expand icon */}
        <div className="shrink-0 text-[#a1a1aa]">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {/* Config panel */}
      {expanded && (
        <div className="border-t border-[#f4f4f5] bg-[#fafafa]">
          {member.isCurrentUser ? (
            <div className="px-5 py-5 flex items-center gap-3">
              <ShieldCheck size={15} className="text-[#a1a1aa]" />
              <p className="text-sm text-[#71717a]">You have full Super Admin access and cannot edit your own permissions.</p>
            </div>
          ) : !canEdit ? (
            <div className="px-5 py-5 flex items-center gap-3">
              <Shield size={15} className="text-[#a1a1aa]" />
              <p className="text-sm text-[#71717a]">Only Super Admins can edit member roles and permissions.</p>
            </div>
          ) : (
            <div className="px-5 py-5 space-y-6">

              {/* Role */}
              <div>
                <p className="text-xs font-semibold text-[#18181b] mb-0.5">Role</p>
                <p className="text-[11px] text-[#71717a] mb-3">Controls the default level of access for this member.</p>
                <RoleSelector
                  value={member.memberRole}
                  onChange={r => onChange({ ...member, memberRole: r })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* App access */}
                <div>
                  <p className="text-xs font-semibold text-[#18181b] mb-0.5">App access</p>
                  <p className="text-[11px] text-[#71717a] mb-3">Choose which apps this member can open and use.</p>
                  <div className="rounded-xl border border-[#e4e4e7] bg-white overflow-hidden divide-y divide-[#f4f4f5]">
                    {APPS.map(app => (
                      <Checkbox
                        key={app.id}
                        checked={member.allowedApps.includes(app.id)}
                        onChange={() => toggleApp(app.id)}
                        label={app.label}
                        description={app.description}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom permissions */}
                <div>
                  <p className="text-xs font-semibold text-[#18181b] mb-0.5">Custom permissions</p>
                  <p className="text-[11px] text-[#71717a] mb-3">Grant specific capabilities on top of the base role.</p>
                  <div className="rounded-xl border border-[#e4e4e7] bg-white overflow-hidden divide-y divide-[#f4f4f5]">
                    {PERMISSIONS.map(perm => (
                      <Checkbox
                        key={perm.id}
                        checked={member.permissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        label={perm.label}
                        description={perm.description}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={onRemove}
                  className="flex items-center gap-1.5 text-xs text-[#dc2626] hover:text-[#b91c1c] transition-colors"
                >
                  <Trash2 size={13} />
                  Remove member
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#a1a1aa]">Changes are saved automatically</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const currentUser = team.find(m => m.isCurrentUser);
  const isSuperAdmin = currentUser?.memberRole === 'super_admin';

  const updateMember = (id: string, updated: TeamMember) => {
    setTeam(prev => prev.map(m => (m.id === id ? updated : m)));
  };

  const removeMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const inviteMember = (name: string, email: string, role: MemberRole) => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name,
      type: 'human',
      email,
      memberRole: role,
      status: 'offline',
      permissions: [],
      allowedApps: ['support_inbox'],
    };
    setTeam(prev => [...prev, newMember]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-8 py-8">

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#18181b]">Team</h1>
              <p className="text-sm text-[#71717a] mt-0.5">
                Manage roles, permissions, and app access for your team members.
              </p>
            </div>
            {isSuperAdmin && (
              <button
                onClick={() => setInviteOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors"
              >
                <Plus size={13} />
                Invite member
              </button>
            )}
          </div>

          {/* Human members */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden mb-6">
            {/* Table header */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-[#e5e7eb] bg-[#fafafa]">
              <div className="w-9 shrink-0" />
              <div className="flex-1 text-xs font-medium text-[#71717a]">Member</div>
              <div className="shrink-0 w-[90px] text-xs font-medium text-[#71717a]">Role</div>
              <div className="hidden lg:block w-[220px] shrink-0 text-xs font-medium text-[#71717a]">App access</div>
              <div className="w-[24px] shrink-0" />
            </div>

            {team.map(member => (
              <MemberRow
                key={member.id}
                member={member}
                expanded={expandedId === member.id}
                onToggle={() => setExpandedId(expandedId === member.id ? null : member.id)}
                onChange={updated => updateMember(member.id, updated)}
                onRemove={() => removeMember(member.id)}
                isSuperAdmin={isSuperAdmin}
              />
            ))}
          </div>

          {/* AI agents — read-only */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-3 border-b border-[#e5e7eb] bg-[#fafafa]">
              <div className="w-9 shrink-0" />
              <div className="flex-1 text-xs font-medium text-[#71717a]">AI agents</div>
              <div className="shrink-0 w-[90px] text-xs font-medium text-[#71717a]">Type</div>
              <div className="hidden lg:block w-[220px] shrink-0 text-xs font-medium text-[#71717a]">Access</div>
              <div className="w-[24px] shrink-0" />
            </div>
            {AI_AGENTS.map(agent => (
              <div key={agent.id} className="flex items-center gap-4 px-5 py-4 border-b border-[#e5e7eb] last:border-0">
                <div className="w-9 h-9 rounded-xl bg-[#ede9fe] flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-[#7c3aed]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#18181b]">{agent.name}</p>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">{agent.description}</p>
                </div>
                <div className="shrink-0 w-[90px]">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md border bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe]">
                    AI Agent
                  </span>
                </div>
                <div className="hidden lg:block w-[220px] shrink-0">
                  <span className="text-xs text-[#71717a]">Managed via Workflows</span>
                </div>
                <div className="w-[24px] shrink-0" />
              </div>
            ))}
          </div>

        </div>
      </main>

      {inviteOpen && (
        <InviteModal
          onClose={() => setInviteOpen(false)}
          onInvite={inviteMember}
        />
      )}
    </div>
  );
}
