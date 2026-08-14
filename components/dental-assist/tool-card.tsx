'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ImageIcon, MapPin, Pencil } from 'lucide-react';
import { DentalTool } from '@/lib/supabase';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/lib/types';

type ToolCardProps = {
  tool: DentalTool;
  onSelect: (tool: DentalTool) => void;
  onEdit: (tool: DentalTool) => void;
};

export const ToolCard = forwardRef<HTMLElement, ToolCardProps>(function ToolCard({
  tool,
  onSelect,
  onEdit,
}, ref) {
  const Icon = CATEGORY_ICONS[tool.category] ?? DEFAULT_CATEGORY_ICON;

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22 }}
      className="group relative overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_16px_50px_rgba(17,17,17,0.06)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-gold-50 via-white to-transparent opacity-90" />

      <button type="button" onClick={() => onSelect(tool)} className="block w-full text-left">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
            <span className="inline-flex items-center rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700 backdrop-blur">
              {tool.category}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-gold-600 backdrop-blur">
              <Icon className="h-4.5 w-4.5" />
            </div>
          </div>

          <div className="relative overflow-hidden border-b border-gray-100 bg-gray-50">
            {tool.image_url ? (
              <img
                src={tool.image_url}
                alt={tool.name}
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-52 w-full items-center justify-center bg-[radial-gradient(circle_at_top,#fff4d5,transparent_45%),linear-gradient(135deg,#fafafa,#ececec)]">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
                  <ImageIcon className="h-4 w-4" />
                  <span>Нет изображения</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold leading-tight text-gray-900 transition group-hover:text-gray-700">
                {tool.name}
              </h3>
              <div className="mt-2 inline-flex items-start gap-1.5 text-sm text-gray-500">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" />
                <span className="leading-snug">{tool.storage_location}</span>
              </div>
            </div>

            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-400 transition group-hover:border-gold-200 group-hover:bg-gold-50 group-hover:text-gold-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">{tool.description}</p>

          <div className="flex flex-wrap gap-2">
            {tool.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
            {tool.tags.length > 4 && (
              <span className="rounded-full border border-dashed border-gold-200 bg-gold-50 px-2.5 py-1 text-xs text-gold-700">
                +{tool.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="absolute bottom-4 right-4 z-10 opacity-0 transition duration-200 group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(tool)}
          className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white/95 px-3 py-2 text-sm font-medium text-gray-700 shadow-lg backdrop-blur transition hover:bg-white"
        >
          <Pencil className="h-4 w-4" />
          <span>Редактировать</span>
        </button>
      </div>
    </motion.article>
  );
});
