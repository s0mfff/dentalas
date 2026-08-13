'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
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

type TagManagerDialogProps = {
  open: boolean;
  tags: string[];
  onClose: () => void;
  onRenameTag: (currentTag: string, nextTag: string) => Promise<void>;
  onDeleteTag: (tag: string) => Promise<void>;
};

export function TagManagerDialog({
  open,
  tags,
  onClose,
  onRenameTag,
  onDeleteTag,
}: TagManagerDialogProps) {
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [nextValue, setNextValue] = useState('');
  const [pendingTag, setPendingTag] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEditingTag(null);
      setNextValue('');
      setPendingTag(null);
      setError(null);
    }
  }, [open]);

  async function handleRename() {
    if (!editingTag) return;
    const normalized = nextValue.trim();

    if (!normalized) {
      setError('Введите новое название тега.');
      return;
    }

    setPendingTag(editingTag);
    setError(null);

    try {
      await onRenameTag(editingTag, normalized);
      setEditingTag(null);
      setNextValue('');
    } catch (renameError) {
      setError(renameError instanceof Error ? renameError.message : 'Не удалось переименовать тег.');
    } finally {
      setPendingTag(null);
    }
  }

  async function handleDelete(tag: string) {
    setPendingTag(tag);
    setError(null);

    try {
      await onDeleteTag(tag);
      if (editingTag === tag) {
        setEditingTag(null);
        setNextValue('');
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Не удалось удалить тег.');
    } finally {
      setPendingTag(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-2xl rounded-3xl border border-gray-100 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Управление тегами
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Здесь можно переименовать тег сразу во всех карточках или убрать его из справочника.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {tags.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-500">
              Пока нет тегов для редактирования.
            </div>
          )}

          {tags.map((tag) => {
            const isEditing = editingTag === tag;
            const isPending = pendingTag === tag;

            return (
              <div
                key={tag}
                className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4"
              >
                {isEditing ? (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input value={nextValue} onChange={(event) => setNextValue(event.target.value)} />
                    <div className="flex gap-2">
                      <Button type="button" onClick={handleRename} disabled={isPending}>
                        Сохранить
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingTag(null);
                          setNextValue('');
                        }}
                        disabled={isPending}
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700">
                      {tag}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTag(tag);
                          setNextValue(tag);
                          setError(null);
                        }}
                        disabled={isPending}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Переименовать
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(tag)}
                        disabled={isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
