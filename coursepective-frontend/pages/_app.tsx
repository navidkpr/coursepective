import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { NextPage, NextPage } from 'next';
import type { AppProps, AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import type { ReactElement, ReactElement, ReactNode, ReactNode } from 'react';
import '../styles/globals.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <UserProvider>  
      <NextNProgress color="#2563eb" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
      <Component {...pageProps} />
    </UserProvider>
  )
}
