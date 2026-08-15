'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MapPin, PackageOpen, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToolModal } from '@/components/dental-assist/tool-modal';
import { getStorageZonePath, StorageZone, StorageZoneItem } from '@/lib/storage-zones';
import { DentalTool, getSupabaseClient } from '@/lib/supabase';

type StorageZoneItemQueryResult = Omit<StorageZoneItem, 'dental_tools'> & {
  dental_tools: DentalTool | DentalTool[] | null;
};

function normalizeStorageZoneItem(item: StorageZoneItemQueryResult): StorageZoneItem {
  return {
    ...item,
    dental_tools: Array.isArray(item.dental_tools) ? item.dental_tools[0] ?? null : item.dental_tools,
  };
}

export function StorageZoneDetails({ activeZone }: { activeZone: StorageZone }) {
  const [tools, setTools] = useState<DentalTool[]>([]);
  const [zoneItems, setZoneItems] = useState<StorageZoneItem[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingToolId, setSavingToolId] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<DentalTool | null>(null);

  const activeItems = useMemo(() => {
    return zoneItems
      .filter((item) => item.zone_id === activeZone.id)
      .filter((relation): relation is StorageZoneItem & { dental_tools: DentalTool } => Boolean(relation.dental_tools))
      .map((relation) => ({ relation, tool: relation.dental_tools }))
      .sort((first, second) => first.relation.sort_order - second.relation.sort_order);
  }, [activeZone.id, zoneItems]);

  const availableTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const linkedIds = new Set(zoneItems.map((item) => item.dental_tool_id));

    return tools.filter((tool) => {
      if (linkedIds.has(tool.id)) return false;
      if (!normalizedQuery) return true;

      return [tool.name, tool.category, tool.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query, tools, zoneItems]);

  async function loadStorageData() {
    setLoading(true);
    setDataError(null);

    try {
      const supabase = getSupabaseClient();
      const [toolsResult, relationsResult] = await Promise.all([
        supabase.from('dental_tools').select('*').order('name', { ascending: true }),
        supabase
          .from('storage_zone_items')
          .select('id, zone_id, dental_tool_id, sort_order, dental_tools(*)')
          .order('sort_order', { ascending: true }),
      ]);

      if (toolsResult.error) throw toolsResult.error;
      if (relationsResult.error) {
        if (relationsResult.error.code === 'PGRST205') {
          throw new Error('Таблица storage_zone_items ещё не создана. Выполните существующую SQL-миграцию в Supabase.');
        }
        throw relationsResult.error;
      }

      setTools((toolsResult.data ?? []) as DentalTool[]);
      const relationRows = (relationsResult.data ?? []) as unknown as StorageZoneItemQueryResult[];
      setZoneItems(relationRows.map(normalizeStorageZoneItem));
    } catch (error) {
      console.error('[DentalAssist][storage-zone:load]', error);
      setDataError(error instanceof Error ? error.message : 'Не удалось загрузить содержимое зоны.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  useEffect(() => {
    setPickerOpen(false);
    setQuery('');
    setDataError(null);
  }, [activeZone.id]);

  async function addToolToZone(tool: DentalTool) {
    setSavingToolId(tool.id);
    setDataError(null);

    try {
      const supabase = getSupabaseClient();
      const nextSortOrder = activeItems.length
        ? Math.max(...activeItems.map(({ relation }) => relation.sort_order)) + 1
        : 1;
      const { data, error } = await supabase
        .from('storage_zone_items')
        .insert({
          zone_id: activeZone.id,
          dental_tool_id: tool.id,
          sort_order: nextSortOrder,
        })
        .select('id, zone_id, dental_tool_id, sort_order, dental_tools(*)')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Supabase не вернул созданную связь.');

      const { data: updatedToolData, error: locationError } = await supabase
        .from('dental_tools')
        .update({ storage_location: getStorageZonePath(activeZone) })
        .eq('id', tool.id)
        .select('*')
        .single();

      if (locationError || !updatedToolData) {
        await supabase.from('storage_zone_items').delete().eq('id', data.id);
        throw new Error(locationError?.message ?? 'Не удалось обновить место хранения в карточке.');
      }

      const updatedTool = updatedToolData as DentalTool;
      const normalizedRelation = normalizeStorageZoneItem(data as unknown as StorageZoneItemQueryResult);

      setZoneItems((current) => [
        ...current,
        { ...normalizedRelation, dental_tools: updatedTool },
      ]);
      setTools((current) => current.map((entry) => (entry.id === updatedTool.id ? updatedTool : entry)));
      setPickerOpen(false);
      setQuery('');
    } catch (error) {
      console.error('[DentalAssist][storage-zone:add]', error);
      setDataError(error instanceof Error ? error.message : 'Не удалось добавить предмет в зону.');
    } finally {
      setSavingToolId(null);
    }
  }

  async function removeToolFromZone(relationId: string) {
    setDataError(null);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('storage_zone_items').delete().eq('id', relationId);
      if (error) throw error;

      setZoneItems((current) => current.filter((item) => item.id !== relationId));
    } catch (error) {
      console.error('[DentalAssist][storage-zone:remove]', error);
      setDataError(error instanceof Error ? error.message : 'Не удалось убрать предмет из зоны.');
    }
  }

  return (
    <>
      <aside className="relative min-h-[520px] bg-[#F3E9DD] p-5 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#B85F43]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeZone.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A6533D]">
                  {activeZone.group}
                </p>
                <h3 className="mt-2 text-2xl font-semibold leading-tight text-[#292521]">{activeZone.title}</h3>
              </div>
              <span className="rounded-md border border-[#CDB8A7] bg-[#FFFDF9] px-2.5 py-1 font-mono text-xs font-bold text-[#8A4634]">
                {activeZone.code}
              </span>
            </div>

            <div className="mt-5 flex items-start gap-3 border-y border-[#D6C5B5] py-4 text-sm text-[#6A5F56]">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-[#B85F43]" />
              <span>{activeZone.location}</span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-[#5F554D]">{activeZone.description}</p>

            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-none items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#3C3732]">
                <PackageOpen className="h-4 w-4 text-[#B85F43]" />
                Содержимое зоны
              </div>
              {activeItems.length > 0 && !pickerOpen && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setPickerOpen(true)}
                  className="w-full min-w-0 flex-1 justify-start rounded-full bg-[#B85F43] text-white hover:bg-[#9F4E37] sm:w-auto"
                >
                  <Plus className="mr-1.5 h-4 w-4 flex-none" />
                  <span className="min-w-0 truncate">Добавить содержимое</span>
                </Button>
              )}
            </div>

            {dataError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-800">
                <p>{dataError}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={loadStorageData}
                  className="mt-3 border-red-200 bg-white text-red-800 hover:bg-red-100"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Повторить загрузку
                </Button>
              </div>
            )}

            {loading && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-[#DDCEC0] bg-[#FFFDF9]/80 px-4 py-8 text-sm text-[#766B62]">
                <Loader2 className="h-4 w-4 animate-spin text-[#B85F43]" />
                Загружаем содержимое
              </div>
            )}

            {!loading && pickerOpen && (
              <div className="mt-4 rounded-2xl border border-[#D4B9A6] bg-[#FFFDF9] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#39332E]">Добавить из справочника</p>
                    <p className="mt-0.5 text-xs text-[#887A70]">Новая карточка здесь не создаётся.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPickerOpen(false);
                      setQuery('');
                    }}
                    className="rounded-lg p-2 text-[#8A7C71] hover:bg-[#F2E6DA] hover:text-[#493F38]"
                    aria-label="Закрыть поиск"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative mt-4">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A887A]" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Название, категория или тег"
                    className="border-[#D8C8BA] bg-white pl-9 focus-visible:ring-[#B85F43]"
                    autoFocus
                  />
                </div>

                <div className="mt-3 max-h-[330px] space-y-2 overflow-y-auto pr-1">
                  {tools.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#D8C8BA] px-4 py-6 text-center">
                      <p className="text-sm font-medium text-[#554B44]">В справочнике пока нет предметов</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#887A70]">
                        Сначала создайте карточку в разделе «Справочник».
                      </p>
                    </div>
                  )}

                  {tools.length > 0 && availableTools.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#D8C8BA] px-4 py-6 text-center text-sm text-[#75685E]">
                      {query.trim() ? 'Ничего не найдено.' : 'Все предметы справочника уже распределены по зонам хранения.'}
                    </div>
                  )}

                  {availableTools.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => addToolToZone(tool)}
                      disabled={savingToolId !== null}
                      className="flex w-full items-start justify-between gap-3 rounded-xl border border-[#E1D5CA] bg-white p-3 text-left transition hover:border-[#C98268] hover:bg-[#FBF3EC] disabled:cursor-wait disabled:opacity-60"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-[#39332E]">{tool.name}</span>
                        <span className="mt-1 block text-xs text-[#806F63]">{tool.category}</span>
                        {tool.tags.length > 0 && (
                          <span className="mt-2 flex flex-wrap gap-1">
                            {tool.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-[#F1E5D9] px-2 py-0.5 text-[10px] text-[#79594C]">
                                {tag}
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                      {savingToolId === tool.id ? (
                        <Loader2 className="mt-0.5 h-4 w-4 flex-none animate-spin text-[#B85F43]" />
                      ) : (
                        <Plus className="mt-0.5 h-4 w-4 flex-none text-[#B85F43]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!loading && !pickerOpen && activeItems.length === 0 && (
              <div className="mt-4 rounded-2xl border border-dashed border-[#D2B9A6] bg-[#FFFDF9]/65 px-4 py-7 text-center">
                <PackageOpen className="mx-auto h-7 w-7 text-[#B88873]" />
                <p className="mt-3 text-sm font-medium text-[#554B44]">Содержимое ещё не добавлено</p>
                <p className="mt-1 text-xs leading-relaxed text-[#887A70]">
                  Выберите существующую карточку из справочника.
                </p>
                <Button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="mt-4 w-full min-w-0 justify-center rounded-full bg-[#B85F43] text-white hover:bg-[#9F4E37]"
                >
                  <Plus className="mr-2 h-4 w-4 flex-none" />
                  <span className="min-w-0 truncate">Добавить содержимое</span>
                </Button>
              </div>
            )}

            {!loading && !pickerOpen && activeItems.length > 0 && (
              <div className="mt-4 space-y-3">
                {activeItems.map(({ relation, tool }) => (
                  <article
                    key={relation.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTool(tool)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedTool(tool);
                      }
                    }}
                    className="cursor-pointer rounded-2xl border border-[#DDCEC0] bg-[#FFFDF9]/80 p-4 outline-none transition hover:border-[#C98268] hover:bg-[#FFFDF9] focus-visible:ring-2 focus-visible:ring-[#B85F43] focus-visible:ring-offset-2"
                    aria-label={`Открыть карточку ${tool.name}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-[#A6533D]">
                            {String(relation.sort_order).padStart(2, '0')}
                          </span>
                          <h4 className="font-semibold text-[#39332E]">{tool.name}</h4>
                        </div>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-[#9A6A58]">{tool.category}</p>
                        {tool.description && <p className="mt-2 text-sm leading-relaxed text-[#6A5F56]">{tool.description}</p>}
                        {tool.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {tool.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-[#F1E5D9] px-2 py-0.5 text-[10px] text-[#79594C]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeToolFromZone(relation.id);
                        }}
                        onKeyDown={(event) => event.stopPropagation()}
                        className="flex-none rounded-lg p-2 text-[#9A7567] transition hover:bg-red-50 hover:text-red-700"
                        aria-label={`Убрать ${tool.name} из зоны`}
                        title="Убрать из зоны"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </aside>

      <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
    </>
  );
}
