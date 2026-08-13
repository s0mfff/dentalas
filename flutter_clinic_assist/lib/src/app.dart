import 'package:flutter/material.dart';

import 'home_screen.dart';
import 'theme.dart';

class ClinicAssistApp extends StatelessWidget {
  const ClinicAssistApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Clinic Assist',
      theme: buildClinicTheme(),
      home: const HomeScreen(),
    );
  }
}
