// import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import {unstable_setRequestLocale} from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import {routing} from '@/i18n/routing';

interface RootLayoutProps {
  children: React.ReactNode;
  params: {locale:string};
}

export type Locale = 'en' | 'et' | 'ru';

export function generateStaticParams(): { locale: Locale }[] {
  const locales: Locale[] = ['en', 'et', 'ru'];
  return locales.map(locale => ({ locale }));
}

const Layout = async({ children, params: {locale} }: RootLayoutProps) => {
  const messages = await getMessages();
  unstable_setRequestLocale(locale);
  
  return (
      <html lang={locale}>
        <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        </body>
      </html>
  );
}

export default Layout;
