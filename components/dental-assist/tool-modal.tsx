'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageIcon, MapPin, Pencil, X } from 'lucide-react';
import { DentalTool } from '@/lib/supabase';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/lib/types';

export function ToolModal({
  tool,
  onClose,
  onEdit,
}: {
  tool: DentalTool | null;
  onClose: () => void;
  onEdit: (tool: DentalTool) => void;
}) {
  useEffect(() => {
    if (!tool) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tool, onClose]);

  const Icon = tool ? CATEGORY_ICONS[tool.category] ?? DEFAULT_CATEGORY_ICON : DEFAULT_CATEGORY_ICON;

  return (
    <AnimatePresence>
      {tool && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-gray-500 backdrop-blur transition-colors hover:text-gray-700"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid md:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[320px] bg-gray-50">
                {tool.image_url ? (
                  <img src={tool.image_url} alt={tool.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center bg-[radial-gradient(circle_at_top,#fff4d5,transparent_45%),linear-gradient(135deg,#fafafa,#ececec)] text-gray-500">
                    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
                      <ImageIcon className="h-4 w-4" />
                      <span>Изображение не добавлено</span>
                    </div>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/25 to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-gold-600 backdrop-blur">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-700 backdrop-blur">
                    {tool.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-semibold leading-tight text-gray-900">{tool.name}</h2>
                    <div className="mt-3 inline-flex items-start gap-2 text-sm text-gray-500">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
                      <span>{tool.storage_location}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEdit(tool)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gold-200 hover:bg-gold-50"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Редактировать</span>
                  </button>
                </div>

                <div className="mt-6 rounded-[24px] border border-gray-100 bg-gray-50/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">
                    Описание
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{tool.description}</p>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">
                    Теги
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-100 bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
