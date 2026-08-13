// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'dart:ui';

import 'package:flutter_test/flutter_test.dart';

import 'package:clinic_assist_flutter/src/app.dart';

void main() {
  testWidgets('library screen renders core sections', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1440, 1200);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(const ClinicAssistApp());
    await tester.pumpAndSettle();

    expect(find.text('Clinic Assist'), findsOneWidget);
    expect(find.text('Предметы и материалы'), findsOneWidget);
    expect(find.text('Найти предмет, тег, врача или место хранения...'), findsOneWidget);
  });
}
