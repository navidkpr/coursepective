import { UserContext, UserProvider } from '@auth0/nextjs-auth0/client';
import Head from 'next/head';
import Navbar from './Navbar';


export interface IPrimaryLayout extends React.ComponentPropsWithoutRef<'div'> {
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({
  children,
  ...divProps
}) => {
  return (
    <>
      <Head>
        <title>Coursepective Website</title>
      </Head>
      <div {...divProps} className={`min-h-screen flex flex-col`}>
        <Navbar />
        <main className="px-20">{children}</main>
        <div className="m-auto" />
      </div>
    </>
  );
};

export default PrimaryLayout;