'use client';

import { motion } from 'framer-motion';
import { BookOpen, Briefcase, ClipboardList, Smile } from 'lucide-react';
import { TabId } from '@/lib/types';

const TABS: { id: TabId; label: string; icon: typeof BookOpen }[] = [
  { id: 'directory', label: 'Справочник', icon: BookOpen },
  { id: 'cabinet', label: 'Кабинет', icon: Briefcase },
  { id: 'protocols', label: 'Протоколы', icon: ClipboardList },
];

export function Header({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-[#F8F9FA]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-400 shadow-sm">
            <Smile className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-tight text-gray-900">
              Dental<span className="text-gold-500">Assist</span>
            </span>
            <span className="inline-flex items-center self-start rounded-full border border-gold-200 bg-gold-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-600">
              Город Улыбок
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-1 self-start rounded-full border border-gray-100 bg-white p-1 shadow-sm sm:self-auto">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors sm:px-4"
              >
                {isActive && (
                  <motion.span
                    layoutId="active-tab-pill"
                    className="absolute inset-0 rounded-full bg-gold-400 shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`}
                />
                <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
