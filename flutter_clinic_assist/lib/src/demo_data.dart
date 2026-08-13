import 'models.dart';

class DemoClinicData {
  static final doctors = <DoctorProfile>[
    const DoctorProfile(
      id: 'doctor-smirnova',
      name: 'Анна Смирнова',
      specialty: 'Терапевт',
      preferences: [
        'Любит, чтобы зеркало, зонд и пинцет лежали в одной линии справа.',
        'Предпочитает заранее готовить матрицы и клинья до посадки пациента.',
        'Просит не вскрывать композит до этапа внесения.',
      ],
      featuredSetups: [
        AppointmentSetup(
          title: 'Лечение кариеса',
          coverage: [
            'Лоток терапевта',
            'Зеркало, зонд, пинцет',
            'Коффердам или ватные валики',
            'Матрицы, клинья, бондинг, композит',
          ],
          notes: [
            'Сразу готовить слюноотсос и дополнительные валики.',
            'До внесения композита держать световую лампу подключенной и проверенной.',
          ],
        ),
      ],
      focusTags: ['терапия', 'композит', 'изоляция'],
    ),
    const DoctorProfile(
      id: 'doctor-volkov',
      name: 'Илья Волков',
      specialty: 'Ортопед',
      preferences: [
        'Просит держать ретракционную нить и временный цемент под рукой.',
        'Любит визуально чистый стол без лишних упаковок.',
      ],
      featuredSetups: [
        AppointmentSetup(
          title: 'Подготовка под коронку',
          coverage: [
            'Ортопедический лоток',
            'Ретракционная нить',
            'Оттискный материал или сканер',
            'Временная коронка и цемент',
          ],
          notes: [
            'Проверить наличие ретрактора и дополнительного аспиратора.',
            'Заранее подготовить контейнер для временной конструкции.',
          ],
        ),
      ],
      focusTags: ['ортопедия', 'слепки', 'временные конструкции'],
    ),
  ];

  static final items = <LibraryItem>[
    const LibraryItem(
      id: 'mirror',
      name: 'Стоматологическое зеркало',
      category: 'Диагностика',
      description: 'Базовый инструмент для обзора полости рта и непрямой визуализации.',
      theory: 'Используется для осмотра, ретракции мягких тканей и направления света.',
      storageLocation: 'Шкаф А1, верхняя кассета',
      tags: ['диагностика', 'осмотр', 'терапия'],
      doctorIds: ['doctor-smirnova', 'doctor-volkov'],
      usageCases: ['Первичный осмотр', 'Лечение кариеса', 'Подготовка под коронку'],
    ),
    const LibraryItem(
      id: 'rubber-dam',
      name: 'Коффердам набор',
      category: 'Изоляция',
      description: 'Набор для изоляции рабочего поля при терапевтических и эндо-приемах.',
      theory: 'Позволяет защитить рабочую область от влаги и повысить качество лечения.',
      storageLocation: 'Шкаф B2, средняя полка',
      tags: ['изоляция', 'терапия', 'эндо'],
      doctorIds: ['doctor-smirnova'],
      usageCases: ['Лечение кариеса', 'Эндодонтия'],
    ),
    const LibraryItem(
      id: 'matrix-kit',
      name: 'Матрицы и клинья',
      category: 'Пломбирование',
      description: 'Комплект для формирования контактного пункта и контуров реставрации.',
      theory: 'Подбирается под класс полости и анатомию зуба.',
      storageLocation: 'Шкаф B1, выдвижной ящик 2',
      tags: ['реставрация', 'композит', 'терапия'],
      doctorIds: ['doctor-smirnova'],
      usageCases: ['Лечение кариеса', 'Восстановление контактного пункта'],
    ),
    const LibraryItem(
      id: 'retraction-cord',
      name: 'Ретракционная нить',
      category: 'Ортопедия',
      description: 'Материал для раскрытия десневой борозды перед снятием оттиска или сканированием.',
      theory: 'Выбирается по толщине и иногда пропитывается гемостатиком.',
      storageLocation: 'Шкаф C1, пенал ортопеда',
      tags: ['ортопедия', 'слепки', 'десна'],
      doctorIds: ['doctor-volkov'],
      usageCases: ['Подготовка под коронку', 'Снятие оттиска'],
    ),
  ];

  static final cabinets = <ClinicCabinet>[
    const ClinicCabinet(
      id: 'cabinet-a1',
      label: 'A1',
      zone: 'Диагностическая зона',
      description: 'Быстрый доступ к базовым инструментам первичного приема.',
      itemIds: ['mirror'],
      frame: CabinetFrame(left: 0.08, top: 0.14, width: 0.24, height: 0.22),
    ),
    const ClinicCabinet(
      id: 'cabinet-b1',
      label: 'B1',
      zone: 'Реставрационная зона',
      description: 'Расходники и формы для пломбировочных этапов.',
      itemIds: ['matrix-kit'],
      frame: CabinetFrame(left: 0.38, top: 0.16, width: 0.22, height: 0.2),
    ),
    const ClinicCabinet(
      id: 'cabinet-b2',
      label: 'B2',
      zone: 'Изоляция',
      description: 'Материалы для защиты рабочего поля и сухости.',
      itemIds: ['rubber-dam'],
      frame: CabinetFrame(left: 0.66, top: 0.12, width: 0.22, height: 0.26),
    ),
    const ClinicCabinet(
      id: 'cabinet-c1',
      label: 'C1',
      zone: 'Ортопедия',
      description: 'Материалы для протезирования и подготовки под конструкции.',
      itemIds: ['retraction-cord'],
      frame: CabinetFrame(left: 0.34, top: 0.52, width: 0.28, height: 0.22),
    ),
  ];
}
