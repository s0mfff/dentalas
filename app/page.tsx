'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { CabinetMap } from '@/components/dental-assist/cabinet-map';
import { DirectoryTab } from '@/components/dental-assist/directory-tab';
import { Header } from '@/components/dental-assist/header';
import { PlaceholderTab } from '@/components/dental-assist/placeholder-tab';
import { StorageMap } from '@/components/dental-assist/storage-map';
import { TabId } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('directory');

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F6EFE5]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,244,214,0.95),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(245,210,161,0.38),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(255,226,194,0.62),_transparent_34%),linear-gradient(180deg,_#FCF6EE_0%,_#F7ECDD_46%,_#F4E6D6_100%)]" />
        <div className="absolute -top-24 left-[8%] h-72 w-72 rounded-full bg-[#FFE6C7]/70 blur-3xl" />
        <div className="absolute right-[6%] top-24 h-80 w-80 rounded-full bg-[#F4D6AF]/50 blur-3xl" />
        <div className="absolute bottom-[-8%] left-1/3 h-96 w-96 rounded-full bg-[#F7C98D]/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(146,104,62,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(146,104,62,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/35 to-transparent" />
      </div>

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-8 rounded-[30px] border border-white/50 bg-white/45 px-5 py-5 shadow-[0_16px_45px_rgba(130,87,45,0.08)] backdrop-blur-md sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B68456]">
                Библиотека клиники
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#2E241B] sm:text-4xl">
                Тёплый и живой справочник для ассистентов
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#6D5A49] sm:text-base">
                Быстро находите предметы, хранение и рабочие подсказки в одном месте, без перегруженного интерфейса.
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-[#7A624C] shadow-sm backdrop-blur">
              <span className="font-medium text-[#3C2F24]">Фокус сегодня:</span> порядок, скорость и удобство обучения
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'directory' && <DirectoryTab />}

            {activeTab === 'cabinet' && <CabinetMap />}

            {activeTab === 'storage-map' && <StorageMap />}

            {activeTab === 'protocols' && (
              <PlaceholderTab
                icon={ClipboardList}
                title="Протоколы"
                description="Здесь появятся протоколы ассистирования по видам приёма. Раздел в разработке."
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
