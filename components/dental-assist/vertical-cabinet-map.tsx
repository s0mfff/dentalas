'use client';

import { useState } from 'react';
import { MousePointer2, Ruler } from 'lucide-react';
import { StorageZoneDetails } from '@/components/dental-assist/storage-zone-details';
import { getStorageZonesForObject } from '@/lib/storage-zones';

type VerticalCabinetMapProps = {
  cabinetTitle: string;
  roomTitle: string;
  storageObjectId: string;
};

type ShelfGeometry = {
  y: number;
  height: number;
};

const SHELF_GEOMETRY: ShelfGeometry[] = [
  { y: 80, height: 86 },
  { y: 170, height: 86 },
  { y: 260, height: 86 },
  { y: 350, height: 86 },
  { y: 480, height: 95 },
  { y: 580, height: 95 },
];

const TERRACOTTA = '#B85F43';

export function VerticalCabinetMap({ cabinetTitle, roomTitle, storageObjectId }: VerticalCabinetMapProps) {
  const cabinetZones = getStorageZonesForObject(storageObjectId);
  const [activeId, setActiveId] = useState(cabinetZones[0]?.id ?? '');
  const activeZone = cabinetZones.find((zone) => zone.id === activeId) ?? cabinetZones[0];

  if (!activeZone) return null;

  return (
    <section className="overflow-hidden rounded-[30px] border border-[#DCCDBE] bg-[#F8F2E9] shadow-[0_24px_70px_rgba(96,63,42,0.10)]">
      <div className="flex flex-col gap-4 border-b border-[#DCCDBE] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A6533D]">
            <Ruler className="h-4 w-4" />
            Техническая схема 02
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#292521] sm:text-3xl">
            {cabinetTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#71675E]">
            {roomTitle}. Выберите полку на технической схеме шкафа.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-[#D9C8B8] bg-[#FFFDF9] px-4 py-2 text-xs text-[#6B625B] sm:self-auto">
          <span className="h-2.5 w-2.5 rounded-full bg-[#B85F43]" />
          {cabinetZones.length} активных зон
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 border-b border-[#DCCDBE] bg-[#FFFDF9] p-3 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="relative overflow-hidden rounded-[22px] border border-[#DDD3C9] bg-[#FBFAF7]">
            <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-[#DDD3C9] bg-[#FFFDF9]/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#766B62] backdrop-blur">
              <MousePointer2 className="h-3.5 w-3.5" />
              Выберите полку
            </div>

            <svg
              viewBox="0 0 620 760"
              role="img"
              aria-label={`Интерактивная схема: ${cabinetTitle}`}
              className="mx-auto h-auto w-full max-w-[620px]"
            >
              <defs>
                <pattern id="vertical-cabinet-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#DED8D1" strokeWidth="0.55" />
                </pattern>
                <filter id="vertical-shelf-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#9D4C37" floodOpacity="0.2" />
                </filter>
              </defs>

              <rect width="620" height="760" fill="#FBFAF7" />
              <rect width="620" height="760" fill="url(#vertical-cabinet-grid)" opacity="0.72" />

              <g fill="none" stroke="#827A73" strokeWidth="1" opacity="0.65">
                <path d="M155 40H465" />
                <path d="M155 34V46M465 34V46" />
                <text x="310" y="31" fill="#716A64" stroke="none" fontSize="11" textAnchor="middle">
                  800 mm
                </text>
                <path d="M490 55V710" />
                <path d="M484 55H496M484 710H496" />
                <text x="510" y="382" fill="#716A64" stroke="none" fontSize="11" textAnchor="middle" transform="rotate(90 510 382)">
                  2100 mm
                </text>
              </g>

              <g fill="#FFFDF9" stroke="#2C2926" strokeWidth="2">
                <rect x="150" y="55" width="320" height="655" />
                <rect x="162" y="68" width="296" height="380" />
                <rect x="162" y="466" width="296" height="224" />
                <rect x="145" y="448" width="330" height="18" />
                <path d="M168 710V733M452 710V733" />
                <ellipse cx="168" cy="736" rx="18" ry="5" />
                <ellipse cx="452" cy="736" rx="18" ry="5" />
              </g>

              {SHELF_GEOMETRY.map((geometry, index) => {
                const zone = cabinetZones[index];
                if (!zone) return null;

                const isActive = zone.id === activeZone.id;

                return (
                  <g
                    key={zone.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${zone.code}: ${zone.title}`}
                    aria-pressed={isActive}
                    onMouseEnter={() => setActiveId(zone.id)}
                    onFocus={() => setActiveId(zone.id)}
                    onClick={() => setActiveId(zone.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActiveId(zone.id);
                      }
                    }}
                    className="cursor-pointer outline-none"
                  >
                    <rect
                      x="175"
                      y={geometry.y}
                      width="270"
                      height={geometry.height}
                      fill={isActive ? TERRACOTTA : '#FFFDF9'}
                      fillOpacity={isActive ? 0.82 : 1}
                      stroke={isActive ? TERRACOTTA : '#2C2926'}
                      strokeWidth={isActive ? 3 : 1.7}
                      filter={isActive ? 'url(#vertical-shelf-shadow)' : undefined}
                      className="transition-all duration-200"
                    />
                    <path
                      d={`M175 ${geometry.y + geometry.height}H445`}
                      fill="none"
                      stroke={isActive ? '#7F3F2D' : '#2C2926'}
                      strokeWidth="5"
                      className="pointer-events-none transition-colors duration-200"
                    />
                    <text
                      x="190"
                      y={geometry.y + 23}
                      fill={isActive ? '#FFF9F5' : '#5F5852'}
                      fontSize="11"
                      fontWeight="700"
                      letterSpacing="1.5"
                      className="pointer-events-none select-none"
                    >
                      {zone.code}
                    </text>
                  </g>
                );
              })}

              <g pointerEvents="none" fill="none" stroke="#2C2926" strokeWidth="1.5">
                <path d="M162 68L175 80M458 68L445 80" />
                <path d="M162 448L175 436M458 448L445 436" />
                <path d="M162 466L175 480M458 466L445 480" />
                <path d="M162 690L175 675M458 690L445 675" />
              </g>
            </svg>
          </div>
        </div>

        <StorageZoneDetails activeZone={activeZone} />
      </div>
    </section>
  );
}
