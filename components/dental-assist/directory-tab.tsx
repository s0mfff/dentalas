'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Loader2, Pencil, Plus, Search, SearchX, Tags } from 'lucide-react';
import { ToolCard } from '@/components/dental-assist/tool-card';
import { TagManagerDialog } from '@/components/dental-assist/tag-manager-dialog';
import { ToolEditorDialog } from '@/components/dental-assist/tool-editor-dialog';
import { ToolModal } from '@/components/dental-assist/tool-modal';
import { DentalTool, DentalToolInput, supabase } from '@/lib/supabase';

const IMAGE_BUCKET = 'tool-images';

export function DirectoryTab() {
  const [tools, setTools] = useState<DentalTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<DentalTool | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<DentalTool | null>(null);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTools() {
      setLoading(true);
      setError(false);

      const { data, error: fetchError } = await supabase
        .from('dental_tools')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!isMounted) return;

      if (fetchError || !data) {
        setError(true);
        setTools([]);
      } else {
        setTools(data);
      }

      setLoading(false);
    }

    loadTools();

    return () => {
      isMounted = false;
    };
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tools.forEach((tool) => tool.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [tools]);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesTag = !activeTag || tool.tags.includes(activeTag);
      if (!matchesTag) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        tool.name,
        tool.category,
        tool.description,
        tool.storage_location,
        tool.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [tools, query, activeTag]);

  async function handleSaveTool(payload: DentalToolInput, toolId?: string) {
    if (toolId) {
      const { data, error: updateError } = await supabase
        .from('dental_tools')
        .update(payload)
        .eq('id', toolId)
        .select('*')
        .single();

      if (updateError || !data) {
        throw new Error('Не удалось обновить карточку.');
      }

      setTools((current) =>
        current
          .map((tool) => (tool.id === toolId ? data : tool))
          .sort((a, b) => a.sort_order - b.sort_order)
      );

      if (selectedTool?.id === toolId) {
        setSelectedTool(data);
      }

      return;
    }

    const { data, error: insertError } = await supabase
      .from('dental_tools')
      .insert(payload)
      .select('*')
      .single();

    if (insertError || !data) {
      throw new Error('Не удалось добавить новый предмет.');
    }

    setTools((current) => [...current, data].sort((a, b) => a.sort_order - b.sort_order));
  }

  async function handleUploadImage(file: File) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Можно загружать только изображения.');
    }

    const compressedFile = await compressImage(file);
    const extension = compressedFile.type === 'image/png' ? 'png' : 'webp';
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const filePath = `tools/${fileName}`;

    const { error: uploadError } = await supabase.storage.from(IMAGE_BUCKET).upload(filePath, compressedFile, {
      contentType: compressedFile.type,
      upsert: false,
    });

    if (uploadError) {
      throw new Error('Не удалось загрузить фото. Проверьте настройку Supabase Storage.');
    }

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleRenameTag(currentTag: string, nextTag: string) {
    const normalized = nextTag.trim();
    if (!normalized) {
      throw new Error('Введите новое название тега.');
    }

    if (normalized === currentTag) {
      return;
    }

    const affectedTools = tools.filter((tool) => tool.tags.includes(currentTag));

    await Promise.all(
      affectedTools.map(async (tool) => {
        const nextTags = tool.tags.map((tag) => (tag === currentTag ? normalized : tag));
        const uniqueTags = Array.from(new Set(nextTags));

        const { error: updateError } = await supabase.from('dental_tools').update({ tags: uniqueTags }).eq('id', tool.id);

        if (updateError) {
          throw new Error(`Не удалось обновить тег «${currentTag}».`);
        }
      })
    );

    setTools((current) =>
      current.map((tool) => ({
        ...tool,
        tags: tool.tags.includes(currentTag)
          ? Array.from(new Set(tool.tags.map((tag) => (tag === currentTag ? normalized : tag))))
          : tool.tags,
      }))
    );

    if (activeTag === currentTag) {
      setActiveTag(normalized);
    }
  }

  async function handleDeleteTag(tagToDelete: string) {
    const affectedTools = tools.filter((tool) => tool.tags.includes(tagToDelete));

    await Promise.all(
      affectedTools.map(async (tool) => {
        const nextTags = tool.tags.filter((tag) => tag !== tagToDelete);

        const { error: updateError } = await supabase.from('dental_tools').update({ tags: nextTags }).eq('id', tool.id);

        if (updateError) {
          throw new Error(`Не удалось удалить тег «${tagToDelete}».`);
        }
      })
    );

    setTools((current) =>
      current.map((tool) => ({
        ...tool,
        tags: tool.tags.filter((tag) => tag !== tagToDelete),
      }))
    );

    if (activeTag === tagToDelete) {
      setActiveTag(null);
    }
  }

  function openCreateDialog() {
    setEditingTool(null);
    setEditorOpen(true);
  }

  function openEditDialog(tool: DentalTool) {
    setSelectedTool(null);
    setEditingTool(tool);
    setEditorOpen(true);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти инструмент, материал или место хранения..."
            className="w-full rounded-2xl border border-gray-100 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-800 shadow-sm outline-none transition-shadow placeholder:text-gray-400 focus:ring-2 focus:ring-gold-300"
          />
        </div>

        <button
          type="button"
          onClick={() => setTagManagerOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <Tags className="h-4 w-4" />
          <span>Теги</span>
        </button>

        <button
          type="button"
          onClick={openCreateDialog}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold-400 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gold-500"
        >
          <Plus className="h-4 w-4" />
          <span>Добавить предмет</span>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <TagButton label="Все" isActive={activeTag === null} onClick={() => setActiveTag(null)} />
        {allTags.map((tag) => (
          <TagButton key={tag} label={tag} isActive={activeTag === tag} onClick={() => setActiveTag(tag)} />
        ))}
      </div>

      <div className="mt-8">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-24 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
            <p className="text-sm">Загружаем справочник...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
            <AlertTriangle className="h-6 w-6 text-gold-500" />
            <p className="text-sm font-medium text-gray-700">Не удалось загрузить справочник</p>
            <p className="text-sm text-gray-400">Проверьте подключение и попробуйте обновить страницу</p>
          </div>
        )}

        {!loading && !error && filteredTools.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
            <SearchX className="h-6 w-6 text-gray-300" />
            <p className="text-sm font-medium text-gray-700">Ничего не найдено</p>
            <p className="text-sm text-gray-400">Попробуйте изменить запрос или сбросить фильтр</p>
          </div>
        )}

        {!loading && !error && filteredTools.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onSelect={setSelectedTool} onEdit={openEditDialog} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} onEdit={openEditDialog} />

      <ToolEditorDialog
        open={editorOpen}
        tool={editingTool}
        availableTags={allTags}
        onClose={() => {
          setEditorOpen(false);
          setEditingTool(null);
        }}
        onSave={handleSaveTool}
        onManageTags={() => setTagManagerOpen(true)}
        onUploadImage={handleUploadImage}
      />

      <TagManagerDialog
        open={tagManagerOpen}
        tags={allTags}
        onClose={() => setTagManagerOpen(false)}
        onRenameTag={handleRenameTag}
        onDeleteTag={handleDeleteTag}
      />

      {selectedTool && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            type="button"
            onClick={() => openEditDialog(selectedTool)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            <span>Редактировать карточку</span>
          </button>
        </div>
      )}
    </div>
  );
}

function TagButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors">
      {isActive && (
        <motion.span
          layoutId="active-tag-pill"
          className="absolute inset-0 rounded-full bg-gold-400 shadow-sm"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-500'}`}>{label}</span>
      {!isActive && <span className="absolute inset-0 rounded-full border border-gray-100 bg-white" />}
    </button>
  );
}

async function compressImage(file: File) {
  const sourceUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(sourceUrl);
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, 'image/webp', 0.78);
    if (!blob) {
      return file;
    }

    const compressed = new File([blob], replaceExtension(file.name, 'webp'), {
      type: 'image/webp',
    });

    return compressed.size < file.size ? compressed : file;
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Не удалось прочитать изображение.'));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

function replaceExtension(fileName: string, nextExtension: string) {
  const baseName = fileName.replace(/\.[^.]+$/, '');
  return `${baseName}.${nextExtension}`;
}
