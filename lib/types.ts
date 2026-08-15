import {
  Activity,
  Copy,
  Flame,
  Layers,
  LucideIcon,
  Package,
  ShieldCheck,
  Stethoscope,
  Sun,
  Syringe,
  Wrench,
} from 'lucide-react';

export type TabId = 'directory' | 'cabinet' | 'storage-map' | 'protocols';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Диагностика': Stethoscope,
  'Анестезия': Syringe,
  'Препарирование': Wrench,
  'Пломбирование': Layers,
  'Эндодонтия': Activity,
  'Слепки': Copy,
  'Изоляция': ShieldCheck,
  'Полимеризация': Sun,
  'Стерилизация': Flame,
  'Расходники': Package,
  'Р”РёР°РіРЅРѕСЃС‚РёРєР°': Stethoscope,
  'РђРЅРµСЃС‚РµР·РёСЏ': Syringe,
  'РџСЂРµРїР°СЂРёСЂРѕРІР°РЅРёРµ': Wrench,
  'РџР»РѕРјР±РёСЂРѕРІР°РЅРёРµ': Layers,
  'Р­РЅРґРѕРґРѕРЅС‚РёСЏ': Activity,
  'РЎР»РµРїРєРё': Copy,
  'РР·РѕР»СЏС†РёСЏ': ShieldCheck,
  'РџРѕР»РёРјРµСЂРёР·Р°С†РёСЏ': Sun,
  'РЎС‚РµСЂРёР»РёР·Р°С†РёСЏ': Flame,
  'Р Р°СЃС…РѕРґРЅРёРєРё': Package,
};

export const DEFAULT_CATEGORY_ICON: LucideIcon = Package;
