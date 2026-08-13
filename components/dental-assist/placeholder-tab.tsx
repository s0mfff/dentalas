'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export function PlaceholderTab({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto mt-8 flex max-w-md flex-col items-center rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-50">
        <Icon className="h-7 w-7 text-gold-500" />
      </div>
      <span className="mt-5 inline-flex items-center rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-600">
        Скоро
      </span>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
    </motion.div>
  );
}
