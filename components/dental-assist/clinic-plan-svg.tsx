'use client';

import Image from 'next/image';
import clinicPlanImage from '@/assets/clinic-plan.png';
import type { ClinicRoom } from '@/lib/storage-map-data';

type ClinicPlanSvgProps = {
  rooms: ClinicRoom[];
  selectedRoomId: ClinicRoom['id'] | null;
  hoveredRoomId: ClinicRoom['id'] | null;
  onRoomSelect: (room: ClinicRoom) => void;
  onRoomHover: (roomId: ClinicRoom['id'] | null) => void;
};

const TERRACOTTA = '#B85F43';

export function ClinicPlanSvg({
  rooms,
  selectedRoomId,
  hoveredRoomId,
  onRoomSelect,
  onRoomHover,
}: ClinicPlanSvgProps) {
  return (
    <div className="relative w-full" role="group" aria-label="Интерактивный план стоматологической клиники">
      <Image
        src={clinicPlanImage}
        alt="План стоматологической клиники сверху"
        priority
        unoptimized
        draggable={false}
        sizes="(max-width: 900px) 820px, 100vw"
        className="block h-auto w-full select-none"
      />

      <div className="absolute inset-0">
        {rooms.map((room) => {
          const selected = selectedRoomId === room.id;
          const hovered = hoveredRoomId === room.id;
          // Visual highlight must follow only hover/focus (accessibility)
          const highlighted = hovered;

          return (
            <button
              key={room.id}
              id={`clinic-${room.id}`}
              type="button"
              aria-label={`${room.title}. ${room.subtitle}`}
              aria-pressed={selected}
              onMouseEnter={() => onRoomHover(room.id)}
              onMouseLeave={() => onRoomHover(null)}
              onFocus={() => onRoomHover(room.id)}
              onBlur={() => onRoomHover(null)}
              onClick={() => onRoomSelect(room)}
              className="group absolute cursor-pointer rounded-sm outline-none"
              style={{
                left: `${room.bounds.x}%`,
                top: `${room.bounds.y}%`,
                width: `${room.bounds.width}%`,
                height: `${room.bounds.height}%`,
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-sm transition-all duration-200"
                style={{
                  backgroundColor: highlighted ? 'rgba(184, 95, 67, 0.18)' : 'transparent',
                  border: highlighted ? `2px solid ${TERRACOTTA}` : '2px solid transparent',
                  boxShadow: highlighted ? '0 8px 24px rgba(135, 75, 55, 0.18)' : 'none',
                }}
              />

              {/* Render informational card only when hovered/focused to avoid overlapping labels */}
              {highlighted && (
                <span
                  className={`pointer-events-none absolute left-3 top-3 z-30 max-w-[220px] rounded-lg border px-2.5 py-1.5 text-left shadow-sm transition-all duration-200 break-words`}
                  style={{ borderColor: '#984A34', backgroundColor: TERRACOTTA, color: '#FFFDF9' }}
                >
                  <span className="block text-[10px] font-bold uppercase tracking-[0.08em]">
                    {room.title}
                  </span>
                  <span className="mt-0.5 block text-[8px] text-[#FFF4EE]">{room.subtitle}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
