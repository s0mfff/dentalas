import 'package:flutter/material.dart';

import 'demo_data.dart';
import 'models.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  AppSection section = AppSection.library;
  UserRole role = UserRole.assistant;
  String query = '';
  String? selectedTag;
  late final TextEditingController searchController;
  late List<LibraryItem> items;
  final doctors = DemoClinicData.doctors;
  final cabinets = DemoClinicData.cabinets;

  @override
  void initState() {
    super.initState();
    items = List<LibraryItem>.from(DemoClinicData.items);
    searchController = TextEditingController();
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  List<String> get tags {
    final set = <String>{};
    for (final item in items) {
      set.addAll(item.tags);
    }
    final values = set.toList()..sort();
    return values;
  }

  List<LibraryItem> get filteredItems {
    final normalized = query.trim().toLowerCase();
    return items.where((item) {
      if (selectedTag != null && !item.tags.contains(selectedTag)) {
        return false;
      }

      if (normalized.isEmpty) {
        return true;
      }

      final relatedDoctors = doctors
          .where((doctor) => item.doctorIds.contains(doctor.id))
          .map((doctor) => doctor.name)
          .join(' ');

      final haystack = [
        item.name,
        item.category,
        item.description,
        item.theory,
        item.storageLocation,
        item.tags.join(' '),
        relatedDoctors,
      ].join(' ').toLowerCase();

      return haystack.contains(normalized);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 980;

    return Scaffold(
      floatingActionButton: role == UserRole.admin && section == AppSection.library
          ? FloatingActionButton.extended(
              onPressed: () => _openItemEditor(),
              icon: const Icon(Icons.add),
              label: const Text('Добавить предмет'),
            )
          : null,
      body: SafeArea(
        child: Row(
          children: [
            if (isDesktop)
              _Sidebar(
                section: section,
                role: role,
                onSectionChanged: (value) => setState(() => section = value),
                onRoleChanged: (value) => setState(() => role = value),
              ),
            Expanded(
              child: Column(
                children: [
                  _TopBar(
                    role: role,
                    section: section,
                    onRoleChanged: (value) => setState(() => role = value),
                  ),
                  Expanded(
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 280),
                      switchInCurve: Curves.easeOutCubic,
                      switchOutCurve: Curves.easeInCubic,
                      child: Padding(
                        key: ValueKey(section),
                        padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
                        child: switch (section) {
                          AppSection.library => _LibrarySection(
                              items: filteredItems,
                              allTags: tags,
                              selectedTag: selectedTag,
                              query: query,
                              searchController: searchController,
                              role: role,
                              doctors: doctors,
                              onQueryChanged: (value) => setState(() => query = value),
                              onTagChanged: (value) => setState(() => selectedTag = value),
                              onOpenItem: _openItemDetails,
                              onEditItem: role == UserRole.admin
                                  ? (item) {
                                      _openItemEditor(item: item);
                                    }
                                  : null,
                            ),
                          AppSection.map => _MapSection(
                              cabinets: cabinets,
                              items: items,
                              onOpenCabinet: _openCabinetDetails,
                            ),
                          AppSection.doctors => _DoctorsSection(
                              doctors: doctors,
                              items: items,
                            ),
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: isDesktop
          ? null
          : NavigationBar(
              selectedIndex: AppSection.values.indexOf(section),
              onDestinationSelected: (index) => setState(() => section = AppSection.values[index]),
              destinations: const [
                NavigationDestination(icon: Icon(Icons.auto_stories_outlined), label: 'Библиотека'),
                NavigationDestination(icon: Icon(Icons.grid_view_rounded), label: 'Карта'),
                NavigationDestination(icon: Icon(Icons.medical_information_outlined), label: 'Врачи'),
              ],
            ),
    );
  }

  void _openItemDetails(LibraryItem item) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _ItemDetailsSheet(
        item: item,
        doctors: doctors.where((doctor) => item.doctorIds.contains(doctor.id)).toList(),
        onEdit: role == UserRole.admin ? () => _openItemEditor(item: item) : null,
      ),
    );
  }

  void _openCabinetDetails(ClinicCabinet cabinet) {
    final cabinetItems = items.where((item) => cabinet.itemIds.contains(item.id)).toList();
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => _CabinetSheet(
        cabinet: cabinet,
        items: cabinetItems,
        onOpenItem: _openItemDetails,
      ),
    );
  }

  Future<void> _openItemEditor({LibraryItem? item}) async {
    final draft = await showDialog<LibraryItem>(
      context: context,
      builder: (context) => _ItemEditorDialog(
        doctors: doctors,
        initialItem: item,
      ),
    );

    if (draft == null) {
      return;
    }

    setState(() {
      final index = items.indexWhere((entry) => entry.id == draft.id);
      if (index == -1) {
        items = [draft, ...items];
      } else {
        items[index] = draft;
      }
    });
  }
}

class _Sidebar extends StatelessWidget {
  const _Sidebar({
    required this.section,
    required this.role,
    required this.onSectionChanged,
    required this.onRoleChanged,
  });

  final AppSection section;
  final UserRole role;
  final ValueChanged<AppSection> onSectionChanged;
  final ValueChanged<UserRole> onRoleChanged;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      width: 284,
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: const Color(0xFFDDDDDD)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Clinic Assist', style: theme.textTheme.headlineMedium),
          const SizedBox(height: 8),
          Text(
            'Учебная библиотека для новых ассистентов стоматологической клиники.',
            style: theme.textTheme.bodyMedium,
          ),
          const SizedBox(height: 28),
          _SectionButton(
            label: 'Библиотека предметов',
            icon: Icons.auto_stories_outlined,
            selected: section == AppSection.library,
            onTap: () => onSectionChanged(AppSection.library),
          ),
          const SizedBox(height: 10),
          _SectionButton(
            label: 'Схема клиники',
            icon: Icons.grid_view_rounded,
            selected: section == AppSection.map,
            onTap: () => onSectionChanged(AppSection.map),
          ),
          const SizedBox(height: 10),
          _SectionButton(
            label: 'Работа с врачами',
            icon: Icons.medical_information_outlined,
            selected: section == AppSection.doctors,
            onTap: () => onSectionChanged(AppSection.doctors),
          ),
          const Spacer(),
          Text('Режим доступа', style: theme.textTheme.titleMedium),
          const SizedBox(height: 12),
          SegmentedButton<UserRole>(
            segments: const [
              ButtonSegment(value: UserRole.assistant, label: Text('Сотрудник')),
              ButtonSegment(value: UserRole.admin, label: Text('Админ')),
            ],
            selected: {role},
            onSelectionChanged: (selection) => onRoleChanged(selection.first),
          ),
        ],
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  const _TopBar({
    required this.role,
    required this.section,
    required this.onRoleChanged,
  });

  final UserRole role;
  final AppSection section;
  final ValueChanged<UserRole> onRoleChanged;

  @override
  Widget build(BuildContext context) {
    final title = switch (section) {
      AppSection.library => 'Предметы и материалы',
      AppSection.map => 'Схематичная модель клиники',
      AppSection.doctors => 'Руководство по врачам',
    };

    final subtitle = switch (section) {
      AppSection.library => 'Поиск по названиям, тегам, местам хранения и врачам.',
      AppSection.map => 'Откройте шкафчик и посмотрите, что внутри.',
      AppSection.doctors => 'Что накрывать на прием и как любит работать каждый врач.',
    };

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 6),
                Text(subtitle, style: Theme.of(context).textTheme.bodyMedium),
              ],
            ),
          ),
          if (MediaQuery.of(context).size.width < 980)
            SegmentedButton<UserRole>(
              segments: const [
                ButtonSegment(value: UserRole.assistant, label: Text('Сотрудник')),
                ButtonSegment(value: UserRole.admin, label: Text('Админ')),
              ],
              selected: {role},
              onSelectionChanged: (selection) => onRoleChanged(selection.first),
            ),
        ],
      ),
    );
  }
}

class _LibrarySection extends StatelessWidget {
  const _LibrarySection({
    required this.items,
    required this.allTags,
    required this.selectedTag,
    required this.query,
    required this.searchController,
    required this.role,
    required this.doctors,
    required this.onQueryChanged,
    required this.onTagChanged,
    required this.onOpenItem,
    required this.onEditItem,
  });

  final List<LibraryItem> items;
  final List<String> allTags;
  final String? selectedTag;
  final String query;
  final TextEditingController searchController;
  final UserRole role;
  final List<DoctorProfile> doctors;
  final ValueChanged<String> onQueryChanged;
  final ValueChanged<String?> onTagChanged;
  final ValueChanged<LibraryItem> onOpenItem;
  final ValueChanged<LibraryItem>? onEditItem;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: searchController,
          onChanged: onQueryChanged,
          decoration: const InputDecoration(
            prefixIcon: Icon(Icons.search_rounded),
            hintText: 'Найти предмет, тег, врача или место хранения...',
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 42,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: const Text('Все'),
                  selected: selectedTag == null,
                  onSelected: (_) => onTagChanged(null),
                ),
              ),
              for (final tag in allTags)
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(tag),
                    selected: selectedTag == tag,
                    onSelected: (_) => onTagChanged(tag),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        Expanded(
          child: items.isEmpty
              ? const _EmptyState(
                  icon: Icons.search_off_rounded,
                  title: 'Ничего не найдено',
                  description: 'Попробуйте другой запрос или снимите фильтр по тегу.',
                )
              : GridView.builder(
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: MediaQuery.of(context).size.width >= 1200
                        ? 3
                        : MediaQuery.of(context).size.width >= 700
                            ? 2
                            : 1,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    mainAxisExtent: 430,
                  ),
                  itemCount: items.length,
                  itemBuilder: (context, index) {
                    final item = items[index];
                    final itemDoctors = doctors
                        .where((doctor) => item.doctorIds.contains(doctor.id))
                        .map((doctor) => doctor.name)
                        .toList();
                    return _ItemCard(
                      item: item,
                      doctors: itemDoctors,
                      role: role,
                      onOpen: () => onOpenItem(item),
                      onEdit: onEditItem == null ? null : () => onEditItem!(item),
                    );
                  },
                ),
        ),
      ],
    );
  }
}

class _MapSection extends StatelessWidget {
  const _MapSection({
    required this.cabinets,
    required this.items,
    required this.onOpenCabinet,
  });

  final List<ClinicCabinet> cabinets;
  final List<LibraryItem> items;
  final ValueChanged<ClinicCabinet> onOpenCabinet;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        final mapHeight = width >= 900 ? 520.0 : 420.0;
        final mapWidth = width.clamp(320.0, 1200.0).toDouble();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Черно-белая схема кабинета', style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 10),
                    Text(
                      'Нажмите на шкафчик, чтобы открыть его содержимое и быстро понять, где лежит нужный материал.',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 18),
                    Container(
                      height: mapHeight,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(color: const Color(0xFF111111), width: 1.3),
                      ),
                      child: Stack(
                        children: [
                          Positioned.fill(
                            child: CustomPaint(
                              painter: _ClinicMapPainter(),
                            ),
                          ),
                          for (final cabinet in cabinets)
                            Positioned(
                              left: cabinet.frame.left * mapWidth,
                              top: cabinet.frame.top * mapHeight,
                              child: _CabinetNode(
                                cabinet: cabinet,
                                width: cabinet.frame.width * mapWidth,
                                height: cabinet.frame.height * mapHeight,
                                onTap: () => onOpenCabinet(cabinet),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.separated(
                itemCount: cabinets.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final cabinet = cabinets[index];
                  final count = items.where((item) => cabinet.itemIds.contains(item.id)).length;
                  return ListTile(
                    title: Text('${cabinet.label} · ${cabinet.zone}'),
                    subtitle: Text('${cabinet.description}\n$count предмет(а) внутри'),
                    isThreeLine: true,
                    trailing: const Icon(Icons.arrow_outward_rounded),
                    onTap: () => onOpenCabinet(cabinet),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
}

class _DoctorsSection extends StatelessWidget {
  const _DoctorsSection({
    required this.doctors,
    required this.items,
  });

  final List<DoctorProfile> doctors;
  final List<LibraryItem> items;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      itemCount: doctors.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final doctor = doctors[index];
        final doctorItems = items.where((item) => item.doctorIds.contains(doctor.id)).toList();
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(doctor.name, style: Theme.of(context).textTheme.titleLarge),
                          const SizedBox(height: 4),
                          Text(doctor.specialty, style: Theme.of(context).textTheme.bodyMedium),
                        ],
                      ),
                    ),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final tag in doctor.focusTags)
                          Chip(label: Text(tag)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 18),
                Text('Как любит работать врач', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                for (final preference in doctor.preferences)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.only(top: 6),
                          child: Icon(Icons.circle, size: 7),
                        ),
                        const SizedBox(width: 10),
                        Expanded(child: Text(preference)),
                      ],
                    ),
                  ),
                const SizedBox(height: 14),
                Text('Что накрывать на прием', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 10),
                for (final setup in doctor.featuredSetups)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8F8F8),
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: const Color(0xFFDDDDDD)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(setup.title, style: Theme.of(context).textTheme.titleMedium),
                          const SizedBox(height: 10),
                          for (final coverage in setup.coverage)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 6),
                              child: Text('• $coverage'),
                            ),
                          const SizedBox(height: 10),
                          for (final note in setup.notes)
                            Text(note, style: Theme.of(context).textTheme.bodyMedium),
                        ],
                      ),
                    ),
                  ),
                const SizedBox(height: 8),
                Text('Часто используемые предметы', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    for (final item in doctorItems)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(color: const Color(0xFFDDDDDD)),
                        ),
                        child: Text(item.name),
                      ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ItemCard extends StatelessWidget {
  const _ItemCard({
    required this.item,
    required this.doctors,
    required this.role,
    required this.onOpen,
    required this.onEdit,
  });

  final LibraryItem item;
  final List<String> doctors;
  final UserRole role;
  final VoidCallback onOpen;
  final VoidCallback? onEdit;

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      duration: const Duration(milliseconds: 260),
      tween: Tween(begin: 0.96, end: 1),
      builder: (context, value, child) => Transform.scale(scale: value, child: child),
      child: InkWell(
        borderRadius: BorderRadius.circular(28),
        onTap: onOpen,
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF111111),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        item.category,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                      ),
                    ),
                    const Spacer(),
                    if (role == UserRole.admin)
                      IconButton(
                        onPressed: onEdit,
                        icon: const Icon(Icons.edit_outlined),
                        tooltip: 'Редактировать',
                      ),
                  ],
                ),
                const SizedBox(height: 14),
                Text(item.name, style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 10),
                Text(item.description, maxLines: 3, overflow: TextOverflow.ellipsis),
                const Spacer(),
                Text(item.storageLocation, style: Theme.of(context).textTheme.bodyMedium),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final tag in item.tags.take(3))
                      Chip(label: Text(tag)),
                  ],
                ),
                if (doctors.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Text(
                    'Врачи: ${doctors.join(', ')}',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ItemDetailsSheet extends StatelessWidget {
  const _ItemDetailsSheet({
    required this.item,
    required this.doctors,
    required this.onEdit,
  });

  final LibraryItem item;
  final List<DoctorProfile> doctors;
  final VoidCallback? onEdit;

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.78,
      minChildSize: 0.55,
      maxChildSize: 0.95,
      builder: (context, controller) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: ListView(
          controller: controller,
          padding: const EdgeInsets.all(24),
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(item.name, style: Theme.of(context).textTheme.headlineMedium),
                ),
                if (onEdit != null)
                  IconButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      onEdit!();
                    },
                    icon: const Icon(Icons.edit_outlined),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text(item.category)),
                for (final tag in item.tags) Chip(label: Text(tag)),
              ],
            ),
            const SizedBox(height: 20),
            _InfoBlock(title: 'Кратко о предмете', body: item.description),
            const SizedBox(height: 14),
            _InfoBlock(title: 'Теория и зачем используется', body: item.theory),
            const SizedBox(height: 14),
            _InfoBlock(title: 'Где лежит', body: item.storageLocation),
            const SizedBox(height: 14),
            _InfoBlock(
              title: 'Когда используется',
              body: item.usageCases.map((value) => '• $value').join('\n'),
            ),
            const SizedBox(height: 14),
            _InfoBlock(
              title: 'Какие врачи используют',
              body: doctors.map((doctor) => '${doctor.name} · ${doctor.specialty}').join('\n'),
            ),
          ],
        ),
      ),
    );
  }
}

class _CabinetSheet extends StatelessWidget {
  const _CabinetSheet({
    required this.cabinet,
    required this.items,
    required this.onOpenItem,
  });

  final ClinicCabinet cabinet;
  final List<LibraryItem> items;
  final ValueChanged<LibraryItem> onOpenItem;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('${cabinet.label} · ${cabinet.zone}', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 8),
          Text(cabinet.description, style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: 18),
          if (items.isEmpty)
            const Text('В этом шкафчике пока нет привязанных предметов.')
          else
            ...items.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Material(
                  color: const Color(0xFFF8F8F8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(22),
                    side: const BorderSide(color: Color(0xFFDDDDDD)),
                  ),
                  child: ListTile(
                    title: Text(item.name),
                    subtitle: Text(item.category),
                    trailing: const Icon(Icons.open_in_new_rounded),
                    onTap: () {
                      Navigator.of(context).pop();
                      onOpenItem(item);
                    },
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _ItemEditorDialog extends StatefulWidget {
  const _ItemEditorDialog({
    required this.doctors,
    this.initialItem,
  });

  final List<DoctorProfile> doctors;
  final LibraryItem? initialItem;

  @override
  State<_ItemEditorDialog> createState() => _ItemEditorDialogState();
}

class _ItemEditorDialogState extends State<_ItemEditorDialog> {
  late final TextEditingController nameController;
  late final TextEditingController categoryController;
  late final TextEditingController descriptionController;
  late final TextEditingController theoryController;
  late final TextEditingController storageController;
  late final TextEditingController tagsController;
  late final TextEditingController usageController;
  late Set<String> selectedDoctorIds;

  @override
  void initState() {
    super.initState();
    final item = widget.initialItem;
    nameController = TextEditingController(text: item?.name ?? '');
    categoryController = TextEditingController(text: item?.category ?? '');
    descriptionController = TextEditingController(text: item?.description ?? '');
    theoryController = TextEditingController(text: item?.theory ?? '');
    storageController = TextEditingController(text: item?.storageLocation ?? '');
    tagsController = TextEditingController(text: (item?.tags ?? const <String>[]).join(', '));
    usageController =
        TextEditingController(text: (item?.usageCases ?? const <String>[]).join(', '));
    selectedDoctorIds = {...?item?.doctorIds};
  }

  @override
  void dispose() {
    nameController.dispose();
    categoryController.dispose();
    descriptionController.dispose();
    theoryController.dispose();
    storageController.dispose();
    tagsController.dispose();
    usageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.initialItem != null;
    return AlertDialog(
      insetPadding: const EdgeInsets.all(20),
      title: Text(isEditing ? 'Редактировать предмет' : 'Новый предмет'),
      content: SizedBox(
        width: 620,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: 'Название'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: categoryController,
                decoration: const InputDecoration(labelText: 'Категория'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: storageController,
                decoration: const InputDecoration(labelText: 'Где лежит'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: tagsController,
                decoration: const InputDecoration(labelText: 'Теги через запятую'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: usageController,
                decoration: const InputDecoration(labelText: 'Сценарии использования через запятую'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: descriptionController,
                maxLines: 3,
                decoration: const InputDecoration(labelText: 'Краткое описание'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: theoryController,
                maxLines: 4,
                decoration: const InputDecoration(labelText: 'Теория и особенности'),
              ),
              const SizedBox(height: 16),
              Text('Какие врачи используют', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  for (final doctor in widget.doctors)
                    FilterChip(
                      label: Text(doctor.name),
                      selected: selectedDoctorIds.contains(doctor.id),
                      onSelected: (selected) {
                        setState(() {
                          if (selected) {
                            selectedDoctorIds.add(doctor.id);
                          } else {
                            selectedDoctorIds.remove(doctor.id);
                          }
                        });
                      },
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Отмена'),
        ),
        FilledButton(
          onPressed: _submit,
          child: const Text('Сохранить'),
        ),
      ],
    );
  }

  void _submit() {
    final name = nameController.text.trim();
    final category = categoryController.text.trim();
    if (name.isEmpty || category.isEmpty) {
      return;
    }

    final item = LibraryItem(
      id: widget.initialItem?.id ?? 'item-${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      category: category,
      description: descriptionController.text.trim(),
      theory: theoryController.text.trim(),
      storageLocation: storageController.text.trim(),
      tags: _splitCsv(tagsController.text),
      doctorIds: selectedDoctorIds.toList(),
      usageCases: _splitCsv(usageController.text),
    );

    Navigator.of(context).pop(item);
  }

  List<String> _splitCsv(String value) {
    return value
        .split(',')
        .map((entry) => entry.trim())
        .where((entry) => entry.isNotEmpty)
        .toList();
  }
}

class _SectionButton extends StatelessWidget {
  const _SectionButton({
    required this.label,
    required this.icon,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      child: Material(
        color: selected ? const Color(0xFF111111) : const Color(0xFFF8F8F8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(22),
          side: BorderSide(
            color: selected ? const Color(0xFF111111) : const Color(0xFFDDDDDD),
          ),
        ),
        child: ListTile(
          leading: Icon(icon, color: selected ? Colors.white : const Color(0xFF111111)),
          title: Text(
            label,
            style: TextStyle(
              color: selected ? Colors.white : const Color(0xFF111111),
              fontWeight: FontWeight.w600,
            ),
          ),
          onTap: onTap,
        ),
      ),
    );
  }
}

class _CabinetNode extends StatelessWidget {
  const _CabinetNode({
    required this.cabinet,
    required this.width,
    required this.height,
    required this.onTap,
  });

  final ClinicCabinet cabinet;
  final double width;
  final double height;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(24),
          child: Ink(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF111111), width: 1.2),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x12000000),
                  blurRadius: 14,
                  offset: Offset(0, 10),
                ),
              ],
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    cabinet.label,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 4),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child: Text(
                      cabinet.zone,
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 420),
        padding: const EdgeInsets.all(28),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: const Color(0xFFDDDDDD)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 42),
            const SizedBox(height: 16),
            Text(title, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            Text(description, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}

class _InfoBlock extends StatelessWidget {
  const _InfoBlock({
    required this.title,
    required this.body,
  });

  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F8F8),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFDDDDDD)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          Text(body),
        ],
      ),
    );
  }
}

class _ClinicMapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final wallPaint = Paint()
      ..color = const Color(0xFF111111)
      ..strokeWidth = 1.2
      ..style = PaintingStyle.stroke;

    final dashedPaint = Paint()
      ..color = const Color(0xFF999999)
      ..strokeWidth = 1;

    final room = RRect.fromRectAndRadius(
      Rect.fromLTWH(18, 18, size.width - 36, size.height - 36),
      const Radius.circular(24),
    );
    canvas.drawRRect(room, wallPaint);

    canvas.drawLine(
      Offset(size.width * 0.14, size.height * 0.46),
      Offset(size.width * 0.86, size.height * 0.46),
      dashedPaint,
    );
    canvas.drawLine(
      Offset(size.width * 0.31, size.height * 0.12),
      Offset(size.width * 0.31, size.height * 0.88),
      dashedPaint,
    );
    canvas.drawLine(
      Offset(size.width * 0.64, size.height * 0.12),
      Offset(size.width * 0.64, size.height * 0.88),
      dashedPaint,
    );

    final textPainter = TextPainter(
      textDirection: TextDirection.ltr,
      text: const TextSpan(
        text: 'Рабочая зона',
        style: TextStyle(
          color: Color(0xFF777777),
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    )..layout();
    textPainter.paint(canvas, Offset(size.width * 0.39, size.height * 0.82));
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
