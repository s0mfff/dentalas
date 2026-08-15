import type { DentalTool } from '@/lib/supabase';

export type StorageType = 'dental_unit' | 'vertical_cabinet';

export type StorageZone = {
  id: string;
  storage_type: StorageType;
  room_id: 'room-02' | 'room-03';
  room_title: string;
  storage_object_id: string;
  storage_title: string;
  code: string;
  title: string;
  path_title: string;
  description: string;
  group: string;
  location: string;
};

export type StorageZoneItem = {
  id: string;
  zone_id: string;
  dental_tool_id: string;
  sort_order: number;
  dental_tools: DentalTool | null;
};

type StorageZoneDefinition = Pick<
  StorageZone,
  'id' | 'code' | 'title' | 'path_title' | 'description' | 'group' | 'location'
>;

const DENTAL_UNIT_CONTEXT = {
  storage_type: 'dental_unit' as const,
  room_id: 'room-03' as const,
  room_title: 'Кабинет 3',
  storage_object_id: 'room-03-dental-unit',
  storage_title: 'Стоматологическая гарнитура',
};

const DENTAL_UNIT_ZONE_DEFINITIONS: StorageZoneDefinition[] = [
  {
    id: 'upper-left',
    code: 'A-01',
    title: 'Навесной шкаф слева',
    path_title: 'Навесной шкаф A-01',
    description: 'Верхняя секция хранения с одной распашной дверцей.',
    group: 'Верхний ряд',
    location: 'Над рабочей зоной, слева',
  },
  {
    id: 'upper-center',
    code: 'A-02',
    title: 'Навесной шкаф по центру',
    path_title: 'Навесной шкаф A-02',
    description: 'Центральная верхняя секция хранения.',
    group: 'Верхний ряд',
    location: 'Над центральной частью столешницы',
  },
  {
    id: 'upper-right',
    code: 'A-03',
    title: 'Навесной шкаф справа',
    path_title: 'Навесной шкаф A-03',
    description: 'Правая верхняя секция хранения.',
    group: 'Верхний ряд',
    location: 'Над рабочей зоной, справа',
  },
  {
    id: 'lower-left',
    code: 'B-01',
    title: 'Нижняя тумба слева',
    path_title: 'Секция B-01',
    description: 'Нижняя секция с распашной дверцей.',
    group: 'Нижний ряд',
    location: 'Под левым краем столешницы',
  },
  {
    id: 'drawer-left-top',
    code: 'B-02.1',
    title: 'Левый верхний ящик',
    path_title: 'Ящик B-02.1',
    description: 'Верхний ящик второго модуля слева.',
    group: 'Блок ящиков',
    location: 'Под столешницей, второй модуль слева',
  },
  {
    id: 'drawer-left-middle',
    code: 'B-02.2',
    title: 'Левый средний ящик',
    path_title: 'Ящик B-02.2',
    description: 'Средний ящик второго модуля слева.',
    group: 'Блок ящиков',
    location: 'Второй модуль слева, средний уровень',
  },
  {
    id: 'drawer-left-bottom',
    code: 'B-02.3',
    title: 'Левый нижний ящик',
    path_title: 'Ящик B-02.3',
    description: 'Нижний ящик второго модуля слева.',
    group: 'Блок ящиков',
    location: 'Второй модуль слева, нижний уровень',
  },
  {
    id: 'drawer-center-top',
    code: 'B-03.1',
    title: 'Центральный верхний ящик',
    path_title: 'Ящик B-03.1',
    description: 'Верхний ящик центрального модуля.',
    group: 'Блок ящиков',
    location: 'Под центральной частью столешницы',
  },
  {
    id: 'drawer-center-middle',
    code: 'B-03.2',
    title: 'Центральный средний ящик',
    path_title: 'Ящик B-03.2',
    description: 'Средний ящик центрального модуля.',
    group: 'Блок ящиков',
    location: 'Центральный модуль, средний уровень',
  },
  {
    id: 'drawer-center-bottom',
    code: 'B-03.3',
    title: 'Центральный нижний ящик',
    path_title: 'Ящик B-03.3',
    description: 'Нижний ящик центрального модуля.',
    group: 'Блок ящиков',
    location: 'Центральный модуль, нижний уровень',
  },
  {
    id: 'lower-right-left',
    code: 'B-04',
    title: 'Правая тумба, левая дверца',
    path_title: 'Секция B-04',
    description: 'Левая дверца правого нижнего блока.',
    group: 'Нижний ряд',
    location: 'Справа от центрального блока',
  },
  {
    id: 'lower-right-right',
    code: 'B-05',
    title: 'Правая тумба, крайняя дверца',
    path_title: 'Секция B-05',
    description: 'Крайняя правая секция нижнего блока.',
    group: 'Нижний ряд',
    location: 'Крайний правый модуль',
  },
];

export const STORAGE_ZONES: StorageZone[] = DENTAL_UNIT_ZONE_DEFINITIONS.map((zone) => ({
  ...DENTAL_UNIT_CONTEXT,
  ...zone,
}));

const VERTICAL_CABINET_SHELVES = [
  { code: 'S-01', title: 'Полка 1', description: 'Первая полка верхнего блока.', group: 'Верхний блок', location: 'Верхний уровень шкафа' },
  { code: 'S-02', title: 'Полка 2', description: 'Вторая полка верхнего блока.', group: 'Верхний блок', location: 'Второй уровень шкафа' },
  { code: 'S-03', title: 'Полка 3', description: 'Третья полка верхнего блока.', group: 'Верхний блок', location: 'Третий уровень шкафа' },
  { code: 'S-04', title: 'Полка 4', description: 'Четвёртая полка верхнего блока.', group: 'Верхний блок', location: 'Нижний уровень верхнего блока' },
  { code: 'S-05', title: 'Полка 5', description: 'Первая полка нижнего блока.', group: 'Нижний блок', location: 'Верхний уровень нижнего блока' },
  { code: 'S-06', title: 'Полка 6', description: 'Нижняя полка шкафа.', group: 'Нижний блок', location: 'Нижний уровень шкафа' },
] as const;

function createVerticalCabinetZones(
  roomId: 'room-02' | 'room-03',
  roomTitle: string,
  storageObjectId: string
): StorageZone[] {
  return VERTICAL_CABINET_SHELVES.map((shelf, index) => ({
    id: `${storageObjectId}-shelf-${String(index + 1).padStart(2, '0')}`,
    storage_type: 'vertical_cabinet',
    room_id: roomId,
    room_title: roomTitle,
    storage_object_id: storageObjectId,
    storage_title: 'Вертикальный шкаф',
    code: shelf.code,
    title: shelf.title,
    path_title: shelf.title,
    description: shelf.description,
    group: shelf.group,
    location: shelf.location,
  }));
}

export const VERTICAL_CABINET_ZONES: StorageZone[] = [
  ...createVerticalCabinetZones('room-02', 'Кабинет 2', 'room-02-vertical-cabinet'),
  ...createVerticalCabinetZones('room-03', 'Кабинет 3', 'room-03-vertical-cabinet'),
];

export const ALL_STORAGE_ZONES: StorageZone[] = [...STORAGE_ZONES, ...VERTICAL_CABINET_ZONES];

export function getStorageZonesForObject(storageObjectId: string): StorageZone[] {
  return ALL_STORAGE_ZONES.filter((zone) => zone.storage_object_id === storageObjectId);
}

export function getStorageZonePath(zone: StorageZone): string {
  return `${zone.room_title} / ${zone.storage_title} / ${zone.path_title}`;
}
