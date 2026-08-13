# Clinic Assist Flutter

Flutter prototype for a dental clinic onboarding library with:

- offline-first demo data
- adaptive desktop/mobile layout
- monochrome cabinet map
- searchable library cards
- doctor workflow guide
- local admin editing in memory

## What is included

- `Library` section with search by name, tags, doctor, and storage location
- `Clinic Map` section with a black-and-white schematic and clickable cabinets
- `Doctors` section with appointment setup notes and work preferences
- `Admin mode` toggle to add and edit items locally inside the running app

## What is not included yet

- persistent local database
- file import/export
- authentication
- media storage
- cloud sync

## First run

1. Install Flutter SDK.
2. In this folder run `flutter pub get`.
3. Run `flutter run -d windows` for desktop or `flutter run` for a connected Android device.

## Suggested next steps

1. Replace demo data with a real local repository based on `sqflite`.
2. Add import/export of JSON so the clinic can update data without a server.
3. Add role protection for admin mode.
4. Add photos for items and cabinet interiors.
