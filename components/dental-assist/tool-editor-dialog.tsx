'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, Loader2, MapPin, Plus, Settings2, Upload, X } from 'lucide-react';
import { getStorageZonePath, StorageZone } from '@/lib/storage-zones';
import { DentalTool, DentalToolInput } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type ToolEditorDialogProps = {
  open: boolean;
  tool: DentalTool | null;
  availableTags: string[];
  availableStorageZones: StorageZone[];
  initialStorageZoneId: string | null;
  onClose: () => void;
  onSave: (payload: DentalToolInput, toolId?: string, storageZoneId?: string) => Promise<void>;
  onManageTags: () => void;
  onUploadImage: (file: File) => Promise<string>;
};

type FormState = {
  name: string;
  category: string;
  storage_location: string;
  description: string;
  image_url: string;
  sort_order: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  category: '',
  storage_location: '',
  description: '',
  image_url: '',
  sort_order: '0',
};

export function ToolEditorDialog({
  open,
  tool,
  availableTags,
  availableStorageZones,
  initialStorageZoneId,
  onClose,
  onSave,
  onManageTags,
  onUploadImage,
}: ToolEditorDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStorageZoneId, setSelectedStorageZoneId] = useState('');
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;

    if (tool) {
      const initialStorageZone = availableStorageZones.find((zone) => zone.id === initialStorageZoneId);
      setForm({
        name: tool.name,
        category: tool.category,
        storage_location: initialStorageZone ? getStorageZonePath(initialStorageZone) : tool.storage_location,
        description: tool.description,
        image_url: tool.image_url ?? '',
        sort_order: String(tool.sort_order),
      });
      setSelectedTags(tool.tags);
    } else {
      setForm(EMPTY_FORM);
      setSelectedTags([]);
    }

    setSelectedStorageZoneId(initialStorageZoneId ?? '');

    setNewTag('');
    setSubmitError(null);
  }, [availableStorageZones, initialStorageZoneId, open, tool]);

  const previewTags = useMemo(() => {
    return selectedTags.length > 0 ? selectedTags : ['тег 1', 'тег 2'];
  }, [selectedTags]);

  const storageZoneGroups = useMemo(() => {
    const groups = new Map<string, { label: string; zones: StorageZone[] }>();

    availableStorageZones.forEach((zone) => {
      const group = groups.get(zone.storage_object_id) ?? {
        label: `${zone.room_title} / ${zone.storage_title}`,
        zones: [],
      };
      group.zones.push(zone);
      groups.set(zone.storage_object_id, group);
    });

    return Array.from(groups.values());
  }, [availableStorageZones]);

  const selectedStorageZone = availableStorageZones.find((zone) => zone.id === selectedStorageZoneId) ?? null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.category.trim() || !selectedStorageZone) {
      setSubmitError('Заполните название, категорию и место хранения.');
      return;
    }

    setSaving(true);
    setSubmitError(null);

    try {
      const imageUrl = form.image_url.trim();
      const payload: DentalToolInput = {
        name: form.name.trim(),
        category: form.category.trim(),
        storage_location: getStorageZonePath(selectedStorageZone),
        description: form.description.trim(),
        image_url: imageUrl || null,
        tags: selectedTags,
        sort_order: Number.parseInt(form.sort_order, 10) || 0,
      };

      if (tool && imageUrl === (tool.image_url ?? '')) {
        payload.image_url = tool.image_url ?? null;
      }

      await onSave(
        payload,
        tool?.id,
        selectedStorageZone.id
      );
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось сохранить предмет.';
      setSubmitError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSubmitError(null);

    try {
      const imageUrl = await onUploadImage(file);
      setForm((current) => ({ ...current, image_url: imageUrl }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить изображение.';
      setSubmitError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]
    );
  }

  function handleAddTag() {
    const normalized = newTag.trim();
    if (!normalized) return;

    setSelectedTags((current) => (current.includes(normalized) ? current : [...current, normalized]));
    setNewTag('');
  }

  function removeTag(tag: string) {
    setSelectedTags((current) => current.filter((value) => value !== tag));
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-3xl border border-gray-100 bg-white p-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-gray-100 p-6 md:border-b-0 md:border-r md:p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-900">
                {tool ? 'Редактировать предмет' : 'Новый предмет'}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Добавьте или обновите карточку инструмента, материала или медикамента.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-4">
              <Field label="Название">
                <Input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Например, стоматологическое зеркало"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Категория">
                  <Input
                    value={form.category}
                    onChange={(event) => updateField('category', event.target.value)}
                    placeholder="Диагностика"
                  />
                </Field>

                <Field label="Порядок">
                  <Input
                    type="number"
                    value={form.sort_order}
                    onChange={(event) => updateField('sort_order', event.target.value)}
                    placeholder="0"
                  />
                </Field>
              </div>

              <Field label="Место хранения">
                <select
                  value={selectedStorageZoneId}
                  onChange={(event) => {
                    const zoneId = event.target.value;
                    const zone = availableStorageZones.find((entry) => entry.id === zoneId);
                    setSelectedStorageZoneId(zoneId);
                    updateField('storage_location', zone ? getStorageZonePath(zone) : '');
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-700 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
                >
                  <option value="">Выберите кабинет, шкаф и секцию</option>
                  {storageZoneGroups.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.path_title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                {selectedStorageZone && (
                  <div className="mt-2 flex items-start gap-2 rounded-xl border border-[#E2D3C6] bg-[#FBF5EE] px-3 py-2 text-xs leading-relaxed text-[#765E50]">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none text-[#B85F43]" />
                    <span>{getStorageZonePath(selectedStorageZone)}</span>
                  </div>
                )}
              </Field>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-700">Теги</span>
                  <button
                    type="button"
                    onClick={onManageTags}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-700"
                  >
                    <Settings2 className="h-4 w-4" />
                    <span>Управлять тегами</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isActive = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          isActive
                            ? 'border-gold-400 bg-gold-400 text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-3">
                  {selectedTags.length > 0 ? (
                    selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-400 transition hover:text-gray-600"
                          aria-label={`Убрать тег ${tag}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">Выберите готовые теги или создайте новый.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(event) => setNewTag(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Новый тег"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить
                  </Button>
                </div>
              </div>

              <Field label="Фотография">
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {uploading ? 'Загружаем...' : 'Выбрать файл'}
                    </Button>

                    <Input
                      value={form.image_url}
                      onChange={(event) => updateField('image_url', event.target.value)}
                      placeholder="Или вставьте готовую ссылку"
                    />
                  </div>

                  <p className="text-xs leading-relaxed text-gray-400">
                    Фото автоматически сжимается перед загрузкой. Рекомендуемый формат: JPG или WEBP.
                  </p>
                </div>
              </Field>

              <Field label="Описание">
                <Textarea
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  placeholder="Что это за предмет, когда и зачем используется"
                  className="min-h-[130px] resize-y"
                />
              </Field>
            </div>

            {submitError && (
              <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </p>
            )}

            <DialogFooter className="mt-6 gap-3 sm:gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={saving || uploading}>
                Отмена
              </Button>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? 'Сохраняем...' : tool ? 'Сохранить изменения' : 'Добавить предмет'}
              </Button>
            </DialogFooter>
          </div>

          <div className="bg-[#FBFBFB] p-6 md:p-8">
            <p className="text-sm font-medium text-gray-500">Предпросмотр карточки</p>

            <div className="mt-4 overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
              <div className="relative h-56 bg-gray-50">
                {form.image_url.trim() ? (
                  <img
                    src={form.image_url.trim()}
                    alt={form.name || 'Предпросмотр'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2">
                      <ImagePlus className="h-4 w-4" />
                      <span>Добавьте фотографию</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-600">
                    {form.category || 'Категория'}
                  </span>
                  <span className="text-xs text-gray-400">Порядок: {form.sort_order || '0'}</span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {form.name || 'Название предмета'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {form.storage_location || 'Место хранения'}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-gray-600">
                  {form.description || 'Описание появится здесь после заполнения формы.'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {previewTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}
