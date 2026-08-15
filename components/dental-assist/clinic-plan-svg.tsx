'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import type { ClinicRoom } from '@/lib/storage-map-data';

type ClinicPlanSvgProps = {
  rooms: ClinicRoom[];
  selectedRoomId: ClinicRoom['id'] | null;
  hoveredRoomId: ClinicRoom['id'] | null;
  onRoomSelect: (room: ClinicRoom) => void;
  onRoomHover: (roomId: ClinicRoom['id'] | null) => void;
};

type InteractiveRoomProps = {
  svgId: string;
  room: ClinicRoom | undefined;
  selectedRoomId: ClinicRoom['id'] | null;
  hoveredRoomId: ClinicRoom['id'] | null;
  onRoomSelect: (room: ClinicRoom) => void;
  onRoomHover: (roomId: ClinicRoom['id'] | null) => void;
  x: number;
  y: number;
  width: number;
  height: number;
  labelX: number;
  labelY: number;
  children?: ReactNode;
};

const COLORS = {
  paper: '#FFFDF9',
  warm: '#F8F2E9',
  terracotta: '#B85F43',
  graphite: '#292521',
  muted: '#766B62',
  line: '#746D66',
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
      viewBox="0 0 1200 800"
      role="img"
      aria-labelledby="clinic-plan-title clinic-plan-description"
      className="block h-auto w-full min-w-[820px] select-none"
    >
      <title id="clinic-plan-title">Интерактивный план стоматологической клиники</title>
      <desc id="clinic-plan-description">
        Архитектурная схема клиники с кабинетами, служебными помещениями и зонами хранения.
      </desc>

      <defs>
        <pattern id="clinic-draft-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke={COLORS.softLine} strokeWidth="0.55" opacity="0.48" />
        </pattern>
        <pattern id="clinic-storage-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#C8B8AA" strokeWidth="2" opacity="0.48" />
        </pattern>
        <filter id="clinic-room-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#874B37" floodOpacity="0.16" />
        </filter>
      </defs>

      <rect width="1200" height="800" fill={COLORS.paper} />
      <rect x="22" y="22" width="1156" height="756" rx="18" fill={COLORS.warm} />
      <rect x="30" y="60" width="1140" height="640" fill={COLORS.paper} />
      <rect x="30" y="60" width="1140" height="640" fill="url(#clinic-draft-grid)" />

      <g id="dimensions" fill="none" stroke={COLORS.line} strokeWidth="1" opacity="0.82" pointerEvents="none">
        <path d="M50 38H1150M50 31V45M1150 31V45" />
        <text x="600" y="32" fill={COLORS.muted} stroke="none" fontSize="12" textAnchor="middle" letterSpacing="1.5">
          11 400 mm
        </text>
        <path d="M12 60V700M5 60H19M5 700H19" />
        <text x="8" y="380" fill={COLORS.muted} stroke="none" fontSize="12" textAnchor="middle" transform="rotate(-90 8 380)" letterSpacing="1.5">
          6 400 mm
        </text>
      </g>

      <InteractiveRoom
        svgId="cabinet-1"
        room={roomById.get('room-01')}
        x={50}
        y={90}
        width={420}
        height={240}
        labelX={78}
        labelY={118}
        {...sharedRoomProps}
      >
        <StorageRun x={72} y={108} width={164} segments={3} />
        <WorkZone x={290} y={216} rotation={180} />
      </InteractiveRoom>

      <g id="sterilization" aria-label="Стерилизационная">
        <rect x="490" y="90" width="170" height="300" fill="#FBF7F1" stroke={COLORS.graphite} strokeWidth="2" />
        <RoomLabel x={510} y={118} title="Стерилизационная" subtitle="Обработка инструментов" />
        <StorageRun x={510} y={145} width={130} segments={2} />
        <rect x="510" y="246" width="130" height="54" rx="4" fill="url(#clinic-storage-hatch)" stroke={COLORS.line} strokeWidth="1.5" />
        <circle cx="535" cy="273" r="13" fill={COLORS.paper} stroke={COLORS.graphite} strokeWidth="1.6" />
        <circle cx="615" cy="273" r="13" fill={COLORS.paper} stroke={COLORS.graphite} strokeWidth="1.6" />
      </g>

      <InteractiveRoom
        svgId="staff-room"
        room={roomById.get('room-04')}
        x={680}
        y={90}
        width={160}
        height={300}
        labelX={700}
        labelY={118}
        {...sharedRoomProps}
      >
        <rect x="705" y="160" width="110" height="64" rx="5" fill={COLORS.paper} stroke={COLORS.graphite} strokeWidth="1.8" />
        <circle cx="725" cy="245" r="13" fill={COLORS.paper} stroke={COLORS.graphite} strokeWidth="1.5" />
        <circle cx="795" cy="245" r="13" fill={COLORS.paper} stroke={COLORS.graphite} strokeWidth="1.5" />
        <StorageRun x={705} y={296} width={110} segments={2} />
      </InteractiveRoom>

      <InteractiveRoom
        svgId="cabinet-3"
        room={roomById.get('room-03')}
        x={900}
        y={90}
        width={250}
        height={240}
        labelX={922}
        labelY={118}
        {...sharedRoomProps}
      >
        <StorageRun x={920} y={142} width={80} segments={2} />
        <WorkZone x={1045} y={222} rotation={90} />
        <rect x="1110" y="115" width="22" height="92" fill="url(#clinic-storage-hatch)" stroke={COLORS.graphite} strokeWidth="1.6" />
      </InteractiveRoom>

      <InteractiveRoom
        svgId="cabinet-2"
        room={roomById.get('room-02')}
        x={900}
        y={340}
        width={250}
        height={240}
        labelX={922}
        labelY={368}
        {...sharedRoomProps}
      >
        <StorageRun x={920} y={392} width={80} segments={2} />
        <WorkZone x={1045} y={470} rotation={90} />
        <rect x="1110" y="478" width="22" height="82" fill="url(#clinic-storage-hatch)" stroke={COLORS.graphite} strokeWidth="1.6" />
      </InteractiveRoom>

      <g id="reception" aria-label="Ресепшен">
        <path d="M50 420H470V580H50Z" fill="#FBF7F1" stroke={COLORS.graphite} strokeWidth="2" />
        <RoomLabel x={74} y={450} title="Ресепшен" subtitle="Входная зона" />
        <path d="M155 493H390V548H180Q155 548 155 523Z" fill={COLORS.paper} stroke={COLORS.graphite} strokeWidth="2" />
        <path d="M180 506H370" fill="none" stroke={COLORS.softLine} strokeWidth="2" />
        <circle cx="112" cy="520" r="18" fill={COLORS.paper} stroke={COLORS.line} strokeWidth="1.5" />
      </g>

      <g id="storage" aria-label="Склад расходных материалов">
        <rect x="490" y="420" width="350" height="160" fill="#FBF7F1" stroke={COLORS.graphite} strokeWidth="2" />
        <RoomLabel x={512} y={450} title="Склад" subtitle="Расходные материалы" />
        <StorageRun x={512} y={486} width={306} segments={5} />
        <StorageRun x={512} y={528} width={306} segments={5} />
      </g>

      <g id="corridor" pointerEvents="none">
        <path d="M50 600H1150V680H50Z" fill="#F6EDE2" stroke={COLORS.graphite} strokeWidth="2" />
        <path d="M85 640H1115" fill="none" stroke="#CDBEB1" strokeWidth="1.2" strokeDasharray="7 8" />
        <text x="600" y="646" fill={COLORS.muted} fontSize="11" textAnchor="middle" letterSpacing="3">
          ОСНОВНОЙ ПРОХОД
        </text>
      </g>

      <g id="architecture-walls" fill="none" stroke={COLORS.graphite} strokeLinecap="square" pointerEvents="none">
        <rect x="30" y="60" width="1140" height="640" strokeWidth="7" />
        <path d="M50 90V330H330M415 330H470V90" strokeWidth="5" />
        <path d="M490 90V390M660 90V390M680 90V390M840 90V390" strokeWidth="5" />
        <path d="M900 90V214M900 286V330H1150M900 340V454M900 526V580H1150" strokeWidth="5" />
        <path d="M50 420V580H470M490 420V580H840" strokeWidth="5" />
      </g>

      <g id="doors" fill="none" stroke={COLORS.line} strokeWidth="1.7" pointerEvents="none">
        <Door x={330} y={330} direction="down" />
        <Door x={520} y={390} direction="down" />
        <Door x={710} y={390} direction="down" />
        <Door x={900} y={214} direction="left" />
        <Door x={900} y={454} direction="left" />
        <Door x={375} y={420} direction="up" />
        <Door x={770} y={420} direction="up" />
      </g>

      <g id="legend" transform="translate(936 618)" pointerEvents="none">
        <rect width="190" height="42" rx="10" fill={COLORS.paper} stroke="#D4C5B8" />
        <rect x="14" y="13" width="16" height="16" fill="url(#clinic-storage-hatch)" stroke={COLORS.line} />
        <text x="40" y="25" fill={COLORS.muted} fontSize="10" letterSpacing="0.5">
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
  x,
  y,
  width,
  height,
  labelX,
  labelY,
  children,
}: InteractiveRoomProps) {
  if (!room) return null;

  const selected = selectedRoomId === room.id;
  const hovered = hoveredRoomId === room.id;
  const highlighted = selected || hovered;

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
        fill={highlighted ? COLORS.terracotta : '#FBF8F3'}
        fillOpacity={selected ? 0.22 : hovered ? 0.14 : 1}
        stroke={highlighted ? COLORS.terracotta : COLORS.graphite}
        strokeWidth={highlighted ? 3 : 2}
        filter={highlighted ? 'url(#clinic-room-shadow)' : undefined}
        style={{ transition: 'fill 180ms ease, fill-opacity 180ms ease, stroke 180ms ease' }}
      />
      {children}
      <RoomLabel x={labelX} y={labelY} title={room.title} subtitle={room.subtitle} active={highlighted} />
    </g>
  );
}

function RoomLabel({
  x,
  y,
  title,
  subtitle,
  active = false,
}: {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  active?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none">
      <text fill={active ? COLORS.terracotta : COLORS.graphite} fontSize="13" fontWeight="700" letterSpacing="1.2">
        {title.toUpperCase()}
      </text>
      <text y="17" fill={COLORS.muted} fontSize="9.5" letterSpacing="0.5">
        {subtitle}
      </text>
    </g>
  );
}

function StorageRun({ x, y, width, segments }: { x: number; y: number; width: number; segments: number }) {
  const segmentWidth = width / segments;

  return (
    <g pointerEvents="none">
      <rect x={x} y={y} width={width} height="32" fill="url(#clinic-storage-hatch)" stroke={COLORS.graphite} strokeWidth="1.5" />
      {Array.from({ length: segments - 1 }, (_, index) => (
        <line
          key={index}
          x1={x + segmentWidth * (index + 1)}
          y1={y}
          x2={x + segmentWidth * (index + 1)}
          y2={y + 32}
          stroke={COLORS.line}
          strokeWidth="1"
        />
      ))}
    </g>
  );
}

function WorkZone({ x, y, rotation }: { x: number; y: number; rotation: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`} pointerEvents="none">
      <ellipse cx="0" cy="0" rx="102" ry="76" fill="none" stroke="#B99A88" strokeWidth="1.2" strokeDasharray="5 6" />
      <rect x="-68" y="-22" width="136" height="44" rx="20" fill={COLORS.paper} stroke={COLORS.graphite} strokeWidth="2" />
      <path d="M-52 -17Q0 0 52 -17M-52 17Q0 0 52 17" fill="none" stroke={COLORS.line} strokeWidth="1.2" />
      <rect x="-92" y="-30" width="28" height="60" rx="11" fill={COLORS.paper} stroke={COLORS.graphite} strokeWidth="2" />
      <circle cx="82" cy="-36" r="17" fill={COLORS.paper} stroke={COLORS.graphite} strokeWidth="1.6" />
      <circle cx="84" cy="38" r="13" fill={COLORS.paper} stroke={COLORS.graphite} strokeWidth="1.6" />
      <path d="M68 -20L76 -28M68 20L77 30" fill="none" stroke={COLORS.graphite} strokeWidth="1.5" />
    </g>
  );
}

function Door({ x, y, direction }: { x: number; y: number; direction: 'up' | 'down' | 'left' }) {
  if (direction === 'left') {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M0 0H-72" />
        <path d="M0 72A72 72 0 0 0-72 0" />
      </g>
    );
  }

  const scale = direction === 'up' ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(1 ${scale})`}>
      <path d="M0 0V72" />
      <path d="M72 0A72 72 0 0 1 0 72" />
    </g>
  );
}
