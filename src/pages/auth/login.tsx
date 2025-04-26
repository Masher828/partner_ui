import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { getMetaDataTitle } from '@/utils/getMetaDataTitle';

const DynamicAdminJourney = dynamic(() => import('@/journeys/auth/Login'), {
  ssr: false,
});

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>{getMetaDataTitle('Sign-in')}</title>
      </Head>
      <Layout>
        <DynamicAdminJourney />
      </Layout>
    </>
  );
}
