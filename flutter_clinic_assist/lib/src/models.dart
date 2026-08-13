enum AppSection { library, map, doctors }

enum UserRole { assistant, admin }

class LibraryItem {
  const LibraryItem({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.theory,
    required this.storageLocation,
    required this.tags,
    required this.doctorIds,
    required this.usageCases,
  });

  final String id;
  final String name;
  final String category;
  final String description;
  final String theory;
  final String storageLocation;
  final List<String> tags;
  final List<String> doctorIds;
  final List<String> usageCases;

  LibraryItem copyWith({
    String? id,
    String? name,
    String? category,
    String? description,
    String? theory,
    String? storageLocation,
    List<String>? tags,
    List<String>? doctorIds,
    List<String>? usageCases,
  }) {
    return LibraryItem(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      description: description ?? this.description,
      theory: theory ?? this.theory,
      storageLocation: storageLocation ?? this.storageLocation,
      tags: tags ?? this.tags,
      doctorIds: doctorIds ?? this.doctorIds,
      usageCases: usageCases ?? this.usageCases,
    );
  }
}

class DoctorProfile {
  const DoctorProfile({
    required this.id,
    required this.name,
    required this.specialty,
    required this.preferences,
    required this.featuredSetups,
    required this.focusTags,
  });

  final String id;
  final String name;
  final String specialty;
  final List<String> preferences;
  final List<AppointmentSetup> featuredSetups;
  final List<String> focusTags;
}

class AppointmentSetup {
  const AppointmentSetup({
    required this.title,
    required this.coverage,
    required this.notes,
  });

  final String title;
  final List<String> coverage;
  final List<String> notes;
}

class CabinetFrame {
  const CabinetFrame({
    required this.left,
    required this.top,
    required this.width,
    required this.height,
  });

  final double left;
  final double top;
  final double width;
  final double height;
}

class ClinicCabinet {
  const ClinicCabinet({
    required this.id,
    required this.label,
    required this.zone,
    required this.description,
    required this.itemIds,
    required this.frame,
  });

  final String id;
  final String label;
  final String zone;
  final String description;
  final List<String> itemIds;
  final CabinetFrame frame;
}
