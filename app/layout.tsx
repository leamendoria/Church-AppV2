import type { Metadata } from 'next'
import './globals.css'
import Head from 'next/head'
import { Merriweather } from 'next/font/google';
import type { PropsWithChildren } from 'react';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return <html><body>{children}</body></html>;
}
