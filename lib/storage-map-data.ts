import type { StaticImageData } from 'next/image';
import cabinetOnePlan from '@/public/clinic-map/cabinet-1.png';
import cabinetTwoPlan from '@/public/clinic-map/cabinet-2.png';
import cabinetThreePlan from '@/public/clinic-map/cabinet-3.png';

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
  interactive?: boolean;
};

export type ClinicRoom = {
  id: 'room-01' | 'room-02' | 'room-03' | 'room-04';
  title: string;
  subtitle: string;
  bounds: ClinicMapBounds;
  storageObjects: ClinicStorageObject[];
  detailPlan?: {
    src: StaticImageData;
    width: number;
    height: number;
  };
};

const RIGHT_UPPER_ROOM: ClinicRoom = {
  id: 'room-03',
  title: 'Кабинет 3',
  subtitle: 'Рабочая зона врача',
  bounds: { x: 70.3, y: 3.8, width: 22.1, height: 39.6 },
  storageObjects: [
    {
      id: 'room-03-vertical-cabinet',
      storage_type: 'vertical_cabinet',
      title: 'Вертикальный шкаф',
      hint: 'Нажмите для просмотра',
      bounds: { x: 84.2, y: 70.2, width: 13, height: 25.5 },
    },
    {
      id: 'room-03-left-tall-cabinet',
      storage_type: 'vertical_cabinet',
      title: 'Шкафчики 3 кабинета',
      hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
      interactive: false,
      bounds: { x: 3.32, y: 5.30, width: 17.29, height: 70.14 },
    },
    {
      id: 'room-03-upper-wall-cabinet',
      storage_type: 'vertical_cabinet',
      title: 'Столик ассистента',
      hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
      interactive: false,
      bounds: { x: 33.40, y: 8.51, width: 15.23, height: 16.16 },
    },
    {
      id: 'room-03-right-base-cabinet',
      storage_type: 'vertical_cabinet',
      title: 'Нижняя тумба',
      hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
      interactive: false,
      bounds: { x: 64.45, y: 81.75, width: 12.70, height: 15.68 },
    },
    {
      id: 'room-03-right-sink',
      storage_type: 'vertical_cabinet',
      title: 'Склад-шкаф 3 кабинета',
      hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
      interactive: false,
      bounds: { x: 77.73, y: 77.47, width: 15.43, height: 19.96 },
    },
  ],
  detailPlan: {
    src: cabinetThreePlan,
    width: 2048,
    height: 1869,
  },
};

const RIGHT_LOWER_ROOM: ClinicRoom = {
  id: 'room-02',
  title: 'Кабинет 2',
  subtitle: 'Рабочая зона врача',
  bounds: { x: 70.3, y: 45.5, width: 22.1, height: 49.5 },
  storageObjects: [
    {
      id: 'room-02-left-tall-cabinet',
      storage_type: 'vertical_cabinet',
      title: 'Шкафчики 2 кабинета',
      hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
      interactive: false,
      bounds: { x: 5.69, y: 23.05, width: 12.29, height: 26.95 },
    },
    {
      id: 'room-02-upper-left-cabinet',
      storage_type: 'vertical_cabinet',
      title: 'Шкафчики 2 кабинета',
      hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
      interactive: false,
      bounds: { x: 17.41, y: 7.18, width: 10.47, height: 16.21 },
    },
    {
      id: 'room-02-upper-center-module',
      storage_type: 'vertical_cabinet',
      title: 'Холодильник',
      hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
      interactive: false,
      bounds: { x: 28.38, y: 7.28, width: 10.41, height: 16.11 },
    },
    {
      id: 'room-02-right-sink',
      storage_type: 'vertical_cabinet',
      title: 'Склад-шкаф 2 кабинета',
      hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
      interactive: false,
      bounds: { x: 76.45, y: 7.47, width: 15.02, height: 15.62 },
    },
    {
      id: 'room-02-lower-center-cabinet',
      storage_type: 'vertical_cabinet',
      title: 'Столик-ассистента',
      hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
      interactive: false,
      bounds: { x: 26.05, y: 83.59, width: 12.23, height: 9.81 },
    },
  ],
  detailPlan: {
    src: cabinetTwoPlan,
    width: 1758,
    height: 2048,
  },
};

export const CLINIC_ROOMS: ClinicRoom[] = [
  {
    id: 'room-01',
    title: 'Кабинет 1',
    subtitle: 'Рабочая зона врача',
    bounds: { x: 3.9, y: 3.8, width: 22.6, height: 35.1 },
    storageObjects: [
      {
        id: 'room-01-upper-wall-cabinet',
        storage_type: 'vertical_cabinet',
        title: 'Столик ассистента',
        hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
        interactive: false,
        bounds: { x: 60.35, y: 11.45, width: 12.16, height: 13.28 },
      },
      {
        id: 'room-01-right-tall-cabinet',
        storage_type: 'vertical_cabinet',
        title: 'Шкафчики 1 кабинета',
        hint: 'Зона обозначена. Детальная схема будет добавлена позже.',
        interactive: false,
        bounds: { x: 83.69, y: 6.73, width: 11.08, height: 85.48 },
      },
    ],
    detailPlan: {
      src: cabinetOnePlan,
      width: 2048,
      height: 1694,
    },
  },
  RIGHT_UPPER_ROOM,
  RIGHT_LOWER_ROOM,
  {
    id: 'room-04',
    title: 'Ординаторская',
    subtitle: 'Зона персонала',
    bounds: { x: 61.4, y: 3.8, width: 8.2, height: 28.2 },
    storageObjects: [],
  },
];
