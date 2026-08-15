'use client';

import type { KeyboardEvent } from 'react';
import { ClinicPlanReferenceLayer } from '@/components/dental-assist/clinic-plan-reference-layer';
import type { ClinicRoom } from '@/lib/storage-map-data';

type ClinicPlanSvgProps = {
  rooms: ClinicRoom[];
  selectedRoomId: ClinicRoom['id'] | null;
  hoveredRoomId: ClinicRoom['id'] | null;
  onRoomSelect: (room: ClinicRoom) => void;
  onRoomHover: (roomId: ClinicRoom['id'] | null) => void;
};

type InteractiveRoomProps = Omit<ClinicPlanSvgProps, 'rooms'> & {
  svgId: string;
  room: ClinicRoom | undefined;
};

const VIEWBOX_WIDTH = 1280;
const VIEWBOX_HEIGHT = 720;

const COLORS = {
  paper: '#FFFDF9',
  warm: '#F8F2E9',
  terracotta: '#B85F43',
  graphite: '#292521',
  muted: '#766B62',
  softLine: '#D8CEC4',
};

export function ClinicPlanSvg({
  rooms,
  selectedRoomId,
  hoveredRoomId,
  onRoomSelect,
  onRoomHover,
}: ClinicPlanSvgProps) {
  const roomById = new Map(rooms.map((room) => [room.id, room]));
  const sharedRoomProps = { selectedRoomId, hoveredRoomId, onRoomSelect, onRoomHover };

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="img"
      aria-labelledby="clinic-reference-title clinic-reference-description"
      className="block h-auto w-full min-w-[820px] select-none"
    >
      <title id="clinic-reference-title">Интерактивный план стоматологической клиники</title>
      <desc id="clinic-reference-description">
        Векторный архитектурный план клиники с интерактивными кабинетами и служебными зонами.
      </desc>

      <defs>
        <pattern id="reference-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke={COLORS.softLine} strokeWidth="0.55" opacity="0.34" />
        </pattern>
        <pattern id="reference-storage-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#BFA999" strokeWidth="2" opacity="0.52" />
        </pattern>
        <filter id="reference-room-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#874B37" floodOpacity="0.18" />
        </filter>
      </defs>

      <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill={COLORS.paper} />
      <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill={COLORS.warm} opacity="0.32" />
      <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#reference-grid)" />

      <g id="reference-architecture" style={{ color: COLORS.graphite }} opacity="0.9">
        <ClinicPlanReferenceLayer />
      </g>

      <g id="work-zones" fill="none" stroke="#B98A73" strokeWidth="1.4" strokeDasharray="7 7" opacity="0.64" pointerEvents="none">
        <ellipse cx="170" cy="194" rx="118" ry="82" />
        <ellipse cx="1080" cy="170" rx="112" ry="76" />
        <ellipse cx="1080" cy="390" rx="112" ry="76" />
      </g>

      <g id="storage-zones" pointerEvents="none">
        <rect x="468" y="408" width="374" height="60" rx="3" fill="url(#reference-storage-hatch)" stroke="#9D806E" strokeWidth="1.2" opacity="0.46" />
        <rect x="850" y="414" width="55" height="58" rx="3" fill="url(#reference-storage-hatch)" stroke="#9D806E" strokeWidth="1.2" opacity="0.46" />
      </g>

      <StaticZone
        id="reception"
        x={48}
        y={514}
        width={408}
        height={106}
        title="Ресепшен"
        subtitle="Входная зона"
      />
      <StaticZone
        id="sterilization"
        x={470}
        y={94}
        width={220}
        height={310}
        title="Стерилизационная"
        subtitle="Обработка инструментов"
      />
      <StaticZone
        id="storage"
        x={458}
        y={404}
        width={448}
        height={74}
        title="Склад"
        subtitle="Расходные материалы"
        compact
      />

      <InteractiveRoom svgId="cabinet-1" room={roomById.get('room-01')} {...sharedRoomProps} />
      <InteractiveRoom svgId="cabinet-3" room={roomById.get('room-03')} {...sharedRoomProps} />
      <InteractiveRoom svgId="cabinet-2" room={roomById.get('room-02')} {...sharedRoomProps} />
      <InteractiveRoom svgId="staff-room" room={roomById.get('room-04')} {...sharedRoomProps} />

      <g id="reference-dimensions" fill="none" stroke={COLORS.muted} strokeWidth="1" opacity="0.78" pointerEvents="none">
        <path d="M45 24H1230M45 17V31M1230 17V31" />
        <text x="637" y="18" fill={COLORS.muted} stroke="none" fontSize="11" textAnchor="middle" letterSpacing="1.4">
          ОБЩИЙ ПЛАН / 12 800 mm
        </text>
        <path d="M20 74V650M13 74H27M13 650H27" />
        <text x="14" y="362" fill={COLORS.muted} stroke="none" fontSize="11" textAnchor="middle" transform="rotate(-90 14 362)" letterSpacing="1.4">
          7 200 mm
        </text>
      </g>

      <g id="reference-legend" transform="translate(1010 654)" pointerEvents="none">
        <rect width="220" height="42" rx="11" fill={COLORS.paper} stroke="#D4C5B8" />
        <rect x="14" y="13" width="16" height="16" fill="url(#reference-storage-hatch)" stroke="#927765" />
        <text x="40" y="25" fill={COLORS.muted} fontSize="10" letterSpacing="0.6">
          ЗОНА ХРАНЕНИЯ
        </text>
      </g>
    </svg>
  );
}

function InteractiveRoom({
  svgId,
  room,
  selectedRoomId,
  hoveredRoomId,
  onRoomSelect,
  onRoomHover,
}: InteractiveRoomProps) {
  if (!room) return null;

  const x = (room.bounds.x / 100) * VIEWBOX_WIDTH;
  const y = (room.bounds.y / 100) * VIEWBOX_HEIGHT;
  const width = (room.bounds.width / 100) * VIEWBOX_WIDTH;
  const height = (room.bounds.height / 100) * VIEWBOX_HEIGHT;
  const selected = selectedRoomId === room.id;
  const hovered = hoveredRoomId === room.id;
  const highlighted = selected || hovered;
  const labelWidth = Math.max(102, room.title.length * 8 + 28);

  function handleKeyDown(event: KeyboardEvent<SVGGElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRoomSelect(room!);
    }
  }

  return (
    <g
      id={svgId}
      role="button"
      tabIndex={0}
      aria-label={`${room.title}. ${room.subtitle}`}
      aria-pressed={selected}
      onMouseEnter={() => onRoomHover(room.id)}
      onMouseLeave={() => onRoomHover(null)}
      onFocus={() => onRoomHover(room.id)}
      onBlur={() => onRoomHover(null)}
      onClick={() => onRoomSelect(room)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer outline-none"
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="3"
        fill={COLORS.terracotta}
        fillOpacity={selected ? 0.23 : hovered ? 0.15 : 0}
        stroke={highlighted ? COLORS.terracotta : 'transparent'}
        strokeWidth={highlighted ? 3 : 1}
        filter={highlighted ? 'url(#reference-room-shadow)' : undefined}
        style={{ transition: 'fill-opacity 180ms ease, stroke 180ms ease' }}
      />

      <g transform={`translate(${x + 13} ${y + 13})`} pointerEvents="none">
        <rect
          width={labelWidth}
          height="38"
          rx="8"
          fill={highlighted ? COLORS.terracotta : COLORS.paper}
          fillOpacity={highlighted ? 0.96 : 0.9}
          stroke={highlighted ? '#984A34' : '#CDBEB1'}
          strokeWidth="1"
        />
        <text x="10" y="16" fill={highlighted ? '#FFFDF9' : COLORS.graphite} fontSize="10.5" fontWeight="700" letterSpacing="0.8">
          {room.title.toUpperCase()}
        </text>
        <text x="10" y="29" fill={highlighted ? '#FFF4EE' : COLORS.muted} fontSize="8.5">
          {room.subtitle}
        </text>
      </g>
    </g>
  );
}

function StaticZone({
  id,
  x,
  y,
  width,
  height,
  title,
  subtitle,
  compact = false,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  compact?: boolean;
}) {
  return (
    <g id={id} pointerEvents="none">
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="3"
        fill={COLORS.warm}
        fillOpacity="0.16"
        stroke="#A99B90"
        strokeWidth="1"
        strokeDasharray="5 6"
      />
      <g transform={`translate(${x + 10} ${y + (compact ? 9 : 11)})`}>
        <rect width={Math.max(88, title.length * 8 + 20)} height={compact ? 25 : 35} rx="7" fill={COLORS.paper} fillOpacity="0.88" stroke="#D2C5BA" />
        <text x="9" y={compact ? 16 : 15} fill={COLORS.graphite} fontSize="9.5" fontWeight="700" letterSpacing="0.6">
          {title.toUpperCase()}
        </text>
        {!compact && (
          <text x="9" y="27" fill={COLORS.muted} fontSize="8">
            {subtitle}
          </text>
        )}
      </g>
    </g>
  );
}
