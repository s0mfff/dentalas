'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CircleDot, MapPinned, MousePointer2, Ruler } from 'lucide-react';
import { CabinetMap } from '@/components/dental-assist/cabinet-map';
import { ClinicPlanSvg } from '@/components/dental-assist/clinic-plan-svg';
import { VerticalCabinetMap } from '@/components/dental-assist/vertical-cabinet-map';
import { CLINIC_ROOMS, ClinicRoom, ClinicStorageObject } from '@/lib/storage-map-data';

export function StorageMap() {
  const [selectedRoomId, setSelectedRoomId] = useState<ClinicRoom['id'] | null>(null);
  const [hoveredRoomId, setHoveredRoomId] = useState<ClinicRoom['id'] | null>(null);
  const [openedRoomId, setOpenedRoomId] = useState<ClinicRoom['id'] | null>(null);
  const [openedStorageObject, setOpenedStorageObject] = useState<ClinicStorageObject | null>(null);
  const selectedRoom = CLINIC_ROOMS.find((room) => room.id === selectedRoomId) ?? null;
  const openedRoom = CLINIC_ROOMS.find((room) => room.id === openedRoomId && room.detailPlan) ?? null;
  const transitionRoom = openedRoom ?? selectedRoom;
  const transformOrigin = transitionRoom
    ? `${transitionRoom.bounds.x + transitionRoom.bounds.width / 2}% ${
        transitionRoom.bounds.y + transitionRoom.bounds.height / 2
      }%`
    : '50% 50%';

  return (
    <div className="relative">
      <motion.section
        animate={openedRoom ? { opacity: 0.08, scale: 1.14 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin }}
        aria-hidden={Boolean(openedRoom)}
        className={`transform-gpu overflow-hidden rounded-[30px] border border-[#DCCDBE] bg-[#F8F2E9] shadow-[0_24px_70px_rgba(96,63,42,0.10)] will-change-transform ${
          openedRoom ? 'pointer-events-none' : ''
        }`}
      >
      <div className="border-b border-[#DCCDBE] px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A6533D]">
              <MapPinned className="h-4 w-4" />
              Навигация по клинике
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#292521] sm:text-3xl">
              Карта хранения
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#71675E]">
              Выберите помещение на плане. Внутренние объекты хранения будут добавлены на следующем этапе.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-[#D9C8B8] bg-[#FFFDF9] px-4 py-2 text-xs text-[#6B625B] sm:self-auto">
            <span className="h-2.5 w-2.5 rounded-full bg-[#B85F43]" />
            4 интерактивные зоны
          </div>
        </div>
      </div>

      <div className="bg-[#FFFDF9] p-3 sm:p-6">
        <div className="relative overflow-x-auto rounded-[22px] border border-[#DDD3C9] bg-[#FBFAF7] shadow-inner">
          <div className="relative min-w-[820px]">
            <ClinicPlanSvg
              rooms={CLINIC_ROOMS}
              selectedRoomId={selectedRoomId}
              hoveredRoomId={hoveredRoomId}
              onRoomSelect={(room) => {
                setSelectedRoomId(room.id);
                setOpenedStorageObject(null);
                if (room.detailPlan) setOpenedRoomId(room.id);
              }}
              onRoomHover={setHoveredRoomId}
            />

            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[#D8CEC4] bg-[#FFFDF9]/92 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#746A62] shadow-sm backdrop-blur">
              <Ruler className="h-3.5 w-3.5" />
              План клиники / уровень 01
            </div>

            <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-[#D8CEC4] bg-[#FFFDF9]/92 px-3 py-1.5 text-[10px] font-medium text-[#746A62] shadow-sm backdrop-blur">
              <MousePointer2 className="h-3.5 w-3.5 text-[#B85F43]" />
              Наведите или нажмите на комнату
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#DCCDBE] bg-[#F3E9DD] px-5 py-5 sm:px-7">
        <AnimatePresence mode="wait" initial={false}>
          {selectedRoom ? (
            <motion.div
              key={selectedRoom.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-1 h-9 w-1 flex-none rounded-full bg-[#B85F43]" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A6533D]">Выбрано помещение</p>
                  <h3 className="mt-1 text-xl font-semibold uppercase text-[#302B27]">{selectedRoom.title}</h3>
                  <p className="mt-1 text-sm text-[#74675E]">{selectedRoom.subtitle}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#D7C6B7] bg-[#FFFDF9]/80 px-4 py-3 text-sm text-[#74675E]">
                Переход внутрь кабинета будет добавлен позже
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-sm text-[#74675E]"
            >
              <CircleDot className="h-5 w-5 flex-none text-[#B85F43]" />
              Выберите одну из четырёх зон на плане клиники.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </motion.section>

      <AnimatePresence initial={false}>
        {openedRoom?.detailPlan && (
          <RoomDetail
            key={openedRoom.id}
            room={openedRoom}
            onBack={() => {
              setOpenedStorageObject(null);
              setOpenedRoomId(null);
            }}
            onOpenStorageObject={setOpenedStorageObject}
          />
        )}

        {openedRoom && openedStorageObject && (
          <motion.div
            key={openedStorageObject.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-30 h-fit min-h-full transform-gpu bg-[#F6EFE5] will-change-transform"
          >
            <div className="mb-4 flex items-center justify-between gap-4 rounded-[22px] border border-[#DCCDBE] bg-[#F8F2E9] px-4 py-3 shadow-sm sm:px-5">
              <button
                type="button"
                onClick={() => setOpenedStorageObject(null)}
                className="inline-flex items-center gap-2 rounded-full border border-[#D8C8BA] bg-[#FFFDF9] px-4 py-2 text-sm font-medium text-[#765E50] transition hover:border-[#C98268] hover:text-[#A6533D]"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад к плану: {openedRoom.title}
              </button>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#A6533D] sm:block">
                {openedRoom.title} / {openedStorageObject.title}
              </span>
            </div>
            {openedStorageObject.storage_type === 'dental_unit' ? (
              <CabinetMap />
            ) : (
              <VerticalCabinetMap
                cabinetTitle={openedStorageObject.title}
                roomTitle={openedRoom.title}
                storageObjectId={openedStorageObject.id}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoomDetail({
  room,
  onBack,
  onOpenStorageObject,
}: {
  room: ClinicRoom;
  onBack: () => void;
  onOpenStorageObject: (storageObject: ClinicStorageObject) => void;
}) {
  if (!room.detailPlan) return null;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transformOrigin: `${room.bounds.x + room.bounds.width / 2}% ${
          room.bounds.y + room.bounds.height / 2
        }%`,
      }}
      className="absolute inset-0 z-20 h-fit min-h-full transform-gpu overflow-hidden rounded-[30px] border border-[#DCCDBE] bg-[#F8F2E9] shadow-[0_24px_70px_rgba(96,63,42,0.10)] will-change-transform"
    >
      <div className="border-b border-[#DCCDBE] px-5 py-5 sm:px-7 sm:py-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-[#D8C8BA] bg-[#FFFDF9] px-4 py-2 text-sm font-medium text-[#765E50] transition hover:border-[#C98268] hover:text-[#A6533D]"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к карте клиники
        </button>

        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#A6533D]">
            План клиники / {room.title}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#292521] sm:text-3xl">{room.title}</h2>
          <p className="mt-2 text-sm text-[#71675E]">{room.subtitle}</p>
        </div>
      </div>

      <div className="bg-[#FFFDF9] p-3 sm:p-6">
        <div className="relative overflow-hidden rounded-[22px] border border-[#DDD3C9] bg-[#FBFAF7] p-3 shadow-inner sm:p-6">
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-[#D8CEC4] bg-[#FFFDF9]/92 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#746A62] shadow-sm backdrop-blur">
            <Ruler className="h-3.5 w-3.5" />
            Детальный план / уровень 02
          </div>

          <div className="mx-auto max-w-3xl overflow-hidden rounded-xl bg-[linear-gradient(rgba(146,104,62,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(146,104,62,0.05)_1px,transparent_1px)] [background-size:24px_24px] pt-10">
            <div className="relative">
              <Image
                src={room.detailPlan.src}
                width={room.detailPlan.width}
                height={room.detailPlan.height}
                alt={`План сверху: ${room.title}`}
                priority
                className="block h-auto w-full select-none mix-blend-multiply"
                draggable={false}
              />

              {room.storageObjects.map((storageObject) => (
                <StorageObjectZone
                  key={storageObject.id}
                  storageObject={storageObject}
                  onOpen={() => onOpenStorageObject(storageObject)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#DCCDBE] bg-[#F3E9DD] px-5 py-4 text-sm text-[#74675E] sm:px-7">
        {room.storageObjects.length > 0
          ? 'Выберите интерактивный объект хранения на плане.'
          : 'Интерактивные объекты хранения будут добавлены на следующем этапе.'}
      </div>
    </motion.section>
  );
}

function StorageObjectZone({
  storageObject,
  onOpen,
}: {
  storageObject: ClinicStorageObject;
  onOpen: () => void;
}) {
  const tooltipOnLeft = storageObject.bounds.x > 70;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Открыть: ${storageObject.title}`}
      className="group absolute z-10 outline-none"
      style={{
        left: `${storageObject.bounds.x}%`,
        top: `${storageObject.bounds.y}%`,
        width: `${storageObject.bounds.width}%`,
        height: `${storageObject.bounds.height}%`,
      }}
    >
      <span className="absolute inset-0 rounded-sm border border-transparent bg-[#B85F43]/0 transition-all duration-200 group-hover:border-[#B85F43] group-hover:bg-[#B85F43]/30 group-hover:shadow-[inset_0_0_0_1px_rgba(184,95,67,0.18)] group-focus-visible:border-[#B85F43] group-focus-visible:bg-[#B85F43]/30 group-focus-visible:shadow-[inset_0_0_0_1px_rgba(184,95,67,0.18)]" />
      <span
        className={`pointer-events-none absolute top-1/2 z-20 w-max max-w-[190px] -translate-y-1/2 rounded-xl border border-[#D7C4B5] bg-[#FFFDF9]/96 px-3 py-2 text-left opacity-0 shadow-[0_10px_28px_rgba(73,49,34,0.16)] backdrop-blur transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
          tooltipOnLeft
            ? 'right-full mr-3 translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0'
            : 'left-full ml-3 -translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0'
        }`}
      >
        <span className="block text-xs font-semibold text-[#39332E]">{storageObject.title}</span>
        <span className="mt-0.5 block text-[10px] text-[#7C6E64]">{storageObject.hint}</span>
      </span>
    </button>
  );
}
