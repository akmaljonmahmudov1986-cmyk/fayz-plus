import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fayz Plyus — Endoskopik Jarrohlik Markazi',
  description: "O'zbekistondagi yetakchi neyrojarrohlik va endoskopik jarrohlik klinikasi. Trigeminal nevralgiya, umurtqa pog'onasi va bosh miya kasalliklari bo'yicha mutaxassis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1862709324284094');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}