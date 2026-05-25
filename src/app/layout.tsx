import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fayz Plyus — Endoskopik Jarrohlik Markazi',
  description: 'O\'zbekistondagi yetakchi neyrojarrohlik va endoskopik jarrohlik klinikasi. Trigeminal nevralgiya, umurtqa pog\'onasi va bosh miya kasalliklari bo\'yicha mutaxassis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
