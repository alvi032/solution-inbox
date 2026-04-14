'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import {
  Plus,
  X,
  Star,
  Crown,
  Flame,
  Tag,
  Zap,
  Shield,
  Filter,
  Inbox,
  Flag,
  Bookmark,
  Users,
  AlertCircle,
  TrendingUp,
  Package,
  CircleDollarSign,
  Heart,
  Bell,
  Lock,
  Globe,
} from 'lucide-react';

interface SmartViewRule {
  id: string;
  variable: string;
  value: string;
}

export interface SmartView {
  label: string;
  iconName: string;
  rules: SmartViewRule[];
}

const VARIABLE_OPTIONS: Record<string, string[]> = {
  Priority: ['High', 'Normal', 'Low'],
  Status: ['Open', 'Closed'],
  Category: ['Order', 'Refund', 'Shipping Issue', 'General', 'Order Cancellation'],
  Assignee: ['Unassigned', 'Sarah Jones', 'Alex M.', 'Lisa R.', 'Tom K.'],
};

const ICON_OPTIONS: { name: string; icon: LucideIcon }[] = [
  { name: 'Star', icon: Star },
  { name: 'Crown', icon: Crown },
  { name: 'Flame', icon: Flame },
  { name: 'Tag', icon: Tag },
  { name: 'Zap', icon: Zap },
  { name: 'Shield', icon: Shield },
  { name: 'Filter', icon: Filter },
  { name: 'Inbox', icon: Inbox },
  { name: 'Flag', icon: Flag },
  { name: 'Bookmark', icon: Bookmark },
  { name: 'Users', icon: Users },
  { name: 'Alert', icon: AlertCircle },
  { name: 'Trending', icon: TrendingUp },
  { name: 'Package', icon: Package },
  { name: 'Dollar', icon: CircleDollarSign },
  { name: 'Heart', icon: Heart },
  { name: 'Bell', icon: Bell },
  { name: 'Lock', icon: Lock },
  { name: 'Globe', icon: Globe },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (view: SmartView) => void;
}

function makeRule(): SmartViewRule {
  return { id: Math.random().toString(36).slice(2), variable: '', value: '' };
}

export default function CreateSmartViewDialog({ open, onOpenChange, onSave }: Props) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Star');
  const [rules, setRules] = useState<SmartViewRule[]>([makeRule()]);

  const updateRule = (id: string, field: 'variable' | 'value', val: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: val, ...(field === 'variable' ? { value: '' } : {}) } : r
      )
    );
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ label: name.trim(), iconName: selectedIcon, rules });
    setName('');
    setSelectedIcon('Star');
    setRules([makeRule()]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-[#e4e4e7]">
          <DialogTitle className="text-base font-semibold text-[#18181b]">Create Smart View</DialogTitle>
          <p className="text-xs text-[#71717a] mt-0.5">Build a custom inbox filtered by ticket properties.</p>
        </DialogHeader>

        <div className="px-5 py-4 space-y-5">
          {/* View Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#18181b]">View Name</label>
            <Input
              placeholder="e.g. High Priority Refunds"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-sm border-[#e4e4e7]"
            />
          </div>

          {/* Icon Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#18181b]">Icon</label>
            <div className="flex flex-wrap gap-1.5">
              {ICON_OPTIONS.map(({ name: iconName, icon: Icon }) => (
                <button
                  key={iconName}
                  onClick={() => setSelectedIcon(iconName)}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-md border transition-colors',
                    selectedIcon === iconName
                      ? 'bg-[#18181b] text-white border-[#18181b]'
                      : 'bg-white text-[#71717a] border-[#e4e4e7] hover:border-[#a1a1aa] hover:text-[#18181b]'
                  )}
                  title={iconName}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Filter Rules */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#18181b]">Filters</label>
            <div className="space-y-2">
              {rules.map((rule, idx) => (
                <div key={rule.id} className="flex items-center gap-2">
                  {idx > 0 && (
                    <span className="text-[11px] text-[#71717a] w-6 text-center shrink-0">AND</span>
                  )}
                  {idx === 0 && <div className="w-6 shrink-0" />}

                  {/* Variable selector */}
                  <Select
                    value={rule.variable}
                    onValueChange={(val) => val && updateRule(rule.id, 'variable', val)}
                  >
                    <SelectTrigger className="h-8 text-xs flex-1 w-full">
                      <SelectValue placeholder="Select variable…" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(VARIABLE_OPTIONS).map((v) => (
                        <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Value selector */}
                  <Select
                    value={rule.value}
                    onValueChange={(val) => val && updateRule(rule.id, 'value', val)}
                    disabled={!rule.variable}
                  >
                    <SelectTrigger className="h-8 text-xs flex-1 w-full">
                      <SelectValue placeholder="Select value…" />
                    </SelectTrigger>
                    <SelectContent>
                      {(VARIABLE_OPTIONS[rule.variable] ?? []).map((v) => (
                        <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <button
                    onClick={() => removeRule(rule.id)}
                    disabled={rules.length === 1}
                    className="w-7 h-7 shrink-0 flex items-center justify-center rounded-md text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setRules((prev) => [...prev, makeRule()])}
              className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#18181b] transition-colors mt-1"
            >
              <Plus size={13} />
              Add filter
            </button>
          </div>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-[#e4e4e7] bg-[#fafafa] flex flex-row justify-end gap-2 rounded-none -mx-0 -mb-0">
          <DialogClose className="h-8 px-3 text-xs rounded-md border border-[#e4e4e7] bg-white text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
            Cancel
          </DialogClose>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!name.trim()}
            className="h-8 px-3 text-xs bg-[#18181b] hover:bg-zinc-700 text-white rounded-md"
          >
            Save View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ICON_OPTIONS };
