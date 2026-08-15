'use client';

import { useState } from 'react';
import { MousePointer2, Ruler } from 'lucide-react';
import { StorageZoneDetails } from '@/components/dental-assist/storage-zone-details';
import { STORAGE_ZONES } from '@/lib/storage-zones';

type ZoneGeometry = {
  zoneId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  handleY: number;
};

const ZONE_GEOMETRY: ZoneGeometry[] = [
  { zoneId: 'upper-left', x: 72, y: 72, width: 270, height: 142, handleY: 190 },
  { zoneId: 'upper-center', x: 342, y: 72, width: 270, height: 142, handleY: 190 },
  { zoneId: 'upper-right', x: 612, y: 72, width: 270, height: 142, handleY: 190 },
  { zoneId: 'lower-left', x: 60, y: 400, width: 165, height: 205, handleY: 422 },
  { zoneId: 'drawer-left-top', x: 225, y: 400, width: 210, height: 68, handleY: 422 },
  { zoneId: 'drawer-left-middle', x: 225, y: 468, width: 210, height: 68, handleY: 490 },
  { zoneId: 'drawer-left-bottom', x: 225, y: 536, width: 210, height: 69, handleY: 558 },
  { zoneId: 'drawer-center-top', x: 435, y: 400, width: 270, height: 68, handleY: 422 },
  { zoneId: 'drawer-center-middle', x: 435, y: 468, width: 270, height: 68, handleY: 490 },
  { zoneId: 'drawer-center-bottom', x: 435, y: 536, width: 270, height: 69, handleY: 558 },
  { zoneId: 'lower-right-left', x: 705, y: 400, width: 115, height: 205, handleY: 422 },
  { zoneId: 'lower-right-right', x: 820, y: 400, width: 115, height: 205, handleY: 422 },
];

const TERRACOTTA = '#B85F43';

export function CabinetMap() {
  const [activeId, setActiveId] = useState(STORAGE_ZONES[0].id);
  const activeZone = STORAGE_ZONES.find((zone) => zone.id === activeId) ?? STORAGE_ZONES[0];

  return (
    <section className="overflow-hidden rounded-[30px] border border-[#DCCDBE] bg-[#F8F2E9] shadow-[0_24px_70px_rgba(96,63,42,0.10)]">
      <div className="flex flex-col gap-4 border-b border-[#DCCDBE] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A6533D]">
            <Ruler className="h-4 w-4" />
            Техническая схема 01
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#292521] sm:text-3xl">
            Стоматологическая гарнитура
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#71675E]">
            Наведите курсор на секцию. На телефоне нажмите на нужный шкаф или ящик.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#D9C8B8] bg-[#FFFDF9] px-4 py-2 text-xs text-[#6B625B]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#B85F43]" />
          {STORAGE_ZONES.length} активных зон
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 border-b border-[#DCCDBE] bg-[#FFFDF9] p-3 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="relative overflow-x-auto rounded-[22px] border border-[#DDD3C9] bg-[#FBFAF7]">
            <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-[#DDD3C9] bg-[#FFFDF9]/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#766B62] backdrop-blur">
              <MousePointer2 className="h-3.5 w-3.5" />
              Выберите зону
            </div>

            <svg
              viewBox="0 0 1000 650"
              role="img"
              aria-label="Интерактивная схема стоматологической гарнитуры"
              className="h-auto w-full min-w-[620px]"
            >
              <defs>
                <pattern id="draft-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#DED8D1" strokeWidth="0.55" />
                </pattern>
                <filter id="zone-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#9D4C37" floodOpacity="0.18" />
                </filter>
              </defs>

              <rect width="1000" height="650" fill="#FBFAF7" />
              <rect width="1000" height="650" fill="url(#draft-grid)" opacity="0.72" />

              <g fill="none" stroke="#827A73" strokeWidth="1" opacity="0.6">
                <path d="M48 48H905" />
                <path d="M48 42V54M905 42V54" />
                <text x="476" y="40" fill="#716A64" stroke="none" fontSize="11" textAnchor="middle">
                  2700 mm
                </text>
                <path d="M952 72V605" />
                <path d="M946 72H958M946 605H958" />
                <text x="972" y="342" fill="#716A64" stroke="none" fontSize="11" textAnchor="middle" transform="rotate(90 972 342)">
                  2100 mm
                </text>
              </g>

              <g fill="#FFFDF9" stroke="#2C2926" strokeWidth="2">
                <path d="M58 348H900L946 382H45Z" />
                <path d="M58 335H900V348H58Z" />
                <path d="M45 382H946V400H47Z" />
                <path d="M75 605V625M210 605V625M450 605V625M695 605V625M925 605V625" />
              </g>

              {ZONE_GEOMETRY.map((geometry) => {
                const zone = STORAGE_ZONES.find((entry) => entry.id === geometry.zoneId);
                if (!zone) return null;

                const isActive = zone.id === activeZone.id;
                const handleWidth = geometry.width > 180 ? 46 : 36;
                const handleX = geometry.x + geometry.width / 2 - handleWidth / 2;

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
                      x={geometry.x}
                      y={geometry.y}
                      width={geometry.width}
                      height={geometry.height}
                      fill={isActive ? '#C96D4F' : '#FFFDF9'}
                      fillOpacity={isActive ? 0.82 : 1}
                      stroke={isActive ? TERRACOTTA : '#292623'}
                      strokeWidth={isActive ? 3 : 2}
                      filter={isActive ? 'url(#zone-shadow)' : undefined}
                      className="transition-all duration-200"
                    />
                    <rect
                      x={handleX}
                      y={geometry.handleY}
                      width={handleWidth}
                      height="6"
                      rx="2"
                      fill={isActive ? '#FFF8F3' : '#FBFAF7'}
                      stroke={isActive ? '#7F3F2D' : '#292623'}
                      strokeWidth="2"
                      className="pointer-events-none transition-colors duration-200"
                    />
                    <text
                      x={geometry.x + 12}
                      y={geometry.y + 20}
                      fill={isActive ? '#FFF9F5' : '#5F5852'}
                      fontSize="10"
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
                <path d="M72 214H882" />
                <path d="M60 605H935" />
                <circle cx="75" cy="628" r="5" fill="#FFFDF9" />
                <circle cx="210" cy="628" r="5" fill="#FFFDF9" />
                <circle cx="450" cy="628" r="5" fill="#FFFDF9" />
                <circle cx="695" cy="628" r="5" fill="#FFFDF9" />
                <circle cx="925" cy="628" r="5" fill="#FFFDF9" />
              </g>
            </svg>
          </div>
        </div>

        <StorageZoneDetails activeZone={activeZone} />
      </div>
    </section>
  );
}
