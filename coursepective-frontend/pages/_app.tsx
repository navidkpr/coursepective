import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
// import NextNProgress from 'nextjs-progressbar';
import type { ReactElement, ReactNode } from 'react';
import Page from '.';
import Layout from '../components/Layout';
import '../styles/globals.css';

// Page.getLayout = function getLayout(page: any) {
//   return (
//     <Layout>{page}</Layout>
//   )
// }

export default function MyApp({ Component, pageProps }: any) {
  // Use the layout defined at the page level, if available
  // const getLayout = Component.getLayout || ((page: any) => page)

  return (
    <>
      <UserProvider>
        <Layout>
          {/* <NextNProgress color="#2563eb" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} /> */}
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </>
  )
}
