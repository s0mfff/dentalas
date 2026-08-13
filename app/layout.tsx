import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DentalAssist — справочник ассистента стоматолога',
  description:
    'Справочник инструментов, материалов и протоколов для ассистента стоматолога клиники «Город Улыбок».',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-[#F8F9FA] text-gray-900 antialiased">{children}</body>
    </html>
  );
}
