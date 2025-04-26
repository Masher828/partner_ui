import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from '../../components/layout';
import { getMetaDataTitle } from '@/utils/getMetaDataTitle';
import { restrictedAuth } from '@/utils/restrictedAuth';

const DynamicAdminJourney = dynamic(() => import('@/journeys/auth/AuthActions'), {
  ssr: false,
});

function AuthActions() {
  return (
    <>
      <Head>
        <title>{getMetaDataTitle('Auth')}</title>
      </Head>
      <Layout>
        <DynamicAdminJourney />
      </Layout>
    </>
  );
}

export default restrictedAuth(AuthActions);
