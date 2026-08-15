export type ClinicMapBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ClinicStorageObject = {
  id: string;
  storage_type: 'dental_unit' | 'vertical_cabinet';
  title: string;
  hint: string;
  bounds: ClinicMapBounds;
};

export type ClinicRoom = {
  id: 'room-01' | 'room-02' | 'room-03' | 'room-04';
  title: string;
  subtitle: string;
  bounds: ClinicMapBounds;
  storageObjects: ClinicStorageObject[];
  detailPlan?: {
    src: string;
    width: number;
    height: number;
  };
};

export const CLINIC_MAP_IMAGE = {
  src: '/clinic-map/clinic-plan-v2.jpg',
  width: 1280,
  height: 720,
};

const RIGHT_UPPER_ROOM: ClinicRoom = {
  id: 'room-03',
  title: 'Кабинет 3',
  subtitle: 'Рабочая зона врача',
  bounds: { x: 74, y: 13.8, width: 21.5, height: 29.8 },
  storageObjects: [
    {
      id: 'room-03-dental-unit',
      storage_type: 'dental_unit',
      title: 'Стоматологическая гарнитура',
      hint: 'Нажмите для просмотра',
      bounds: { x: 2.6, y: 3.2, width: 20, height: 45 },
    },
    {
      id: 'room-03-vertical-cabinet',
      storage_type: 'vertical_cabinet',
      title: 'Вертикальный шкаф',
      hint: 'Нажмите для просмотра',
      bounds: { x: 84.2, y: 70.2, width: 13, height: 25.5 },
    },
  ],
  detailPlan: {
    src: '/clinic-map/cabinet-2.png',
    width: 1426,
    height: 1103,
  },
};

const RIGHT_LOWER_ROOM: ClinicRoom = {
  id: 'room-02',
  title: 'Кабинет 2',
  subtitle: 'Рабочая зона врача',
  bounds: { x: 74, y: 44.5, width: 21.5, height: 30.5 },
  storageObjects: [
    {
      id: 'room-02-vertical-cabinet',
      storage_type: 'vertical_cabinet',
      title: 'Вертикальный шкаф',
      hint: 'Нажмите для просмотра',
      bounds: { x: 83.7, y: 4.8, width: 11.8, height: 18 },
    },
  ],
  detailPlan: {
    src: '/clinic-map/cabinet-3.png',
    width: 1254,
    height: 1254,
  },
};

export const CLINIC_ROOMS: ClinicRoom[] = [
  {
    id: 'room-01',
    title: 'Кабинет 1',
    subtitle: 'Рабочая зона врача',
    bounds: { x: 3.4, y: 13.8, width: 35.4, height: 30.1 },
    storageObjects: [],
    detailPlan: {
      src: '/clinic-map/cabinet-1.png',
      width: 1662,
      height: 946,
    },
  },
  RIGHT_UPPER_ROOM,
  RIGHT_LOWER_ROOM,
  {
    id: 'room-04',
    title: 'Ординаторская',
    subtitle: 'Зона персонала',
    bounds: { x: 56.8, y: 13.8, width: 10.2, height: 40.6 },
    storageObjects: [],
  },
];
