import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing.');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const testName = `Codex storage test ${Date.now()}`;
let toolId = null;

try {
  const created = await supabase
    .from('dental_tools')
    .insert({
      name: testName,
      category: 'Тест',
      description: 'Временная проверка связи зон',
      tags: ['тест'],
      image_url: null,
      storage_location: 'Кабинет 2 / Вертикальный шкаф / Полка 1',
      sort_order: 99999,
    })
    .select('*')
    .single();

  if (created.error) throw created.error;
  toolId = created.data.id;

  const firstPlacement = await supabase.from('storage_zone_items').insert({
    zone_id: 'room-02-vertical-cabinet-shelf-01',
    dental_tool_id: toolId,
    sort_order: 99999,
  });
  if (firstPlacement.error) throw firstPlacement.error;

  const firstReload = await supabase
    .from('storage_zone_items')
    .select('zone_id, dental_tools(name, storage_location)')
    .eq('dental_tool_id', toolId)
    .single();
  if (firstReload.error) throw firstReload.error;
  if (firstReload.data.zone_id !== 'room-02-vertical-cabinet-shelf-01') {
    throw new Error('The first placement was not persisted.');
  }

  const updatedTool = await supabase
    .from('dental_tools')
    .update({ storage_location: 'Кабинет 3 / Вертикальный шкаф / Полка 2' })
    .eq('id', toolId);
  if (updatedTool.error) throw updatedTool.error;

  const secondPlacement = await supabase.from('storage_zone_items').insert({
    zone_id: 'room-03-vertical-cabinet-shelf-02',
    dental_tool_id: toolId,
    sort_order: 99999,
  });
  if (secondPlacement.error) throw secondPlacement.error;

  const oldPlacementCleanup = await supabase
    .from('storage_zone_items')
    .delete()
    .eq('dental_tool_id', toolId)
    .neq('zone_id', 'room-03-vertical-cabinet-shelf-02');
  if (oldPlacementCleanup.error) throw oldPlacementCleanup.error;

  const secondReload = await supabase
    .from('storage_zone_items')
    .select('zone_id, dental_tools(name, storage_location)')
    .eq('dental_tool_id', toolId)
    .single();
  if (secondReload.error) throw secondReload.error;
  if (secondReload.data.zone_id !== 'room-03-vertical-cabinet-shelf-02') {
    throw new Error('The updated placement was not persisted.');
  }

  console.log(
    JSON.stringify(
      {
        insert: true,
        firstReload: firstReload.data.zone_id,
        update: true,
        secondReload: secondReload.data.zone_id,
      },
      null,
      2
    )
  );
} finally {
  if (toolId) {
    const cleanup = await supabase.from('dental_tools').delete().eq('id', toolId);
    if (cleanup.error) {
      console.error('TEST_CLEANUP_FAILED', cleanup.error.message);
      process.exitCode = 1;
    }
  }
}
