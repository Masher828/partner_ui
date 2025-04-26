import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getMetaDataTitle } from '@/utils/getMetaDataTitle';
import { restrictedAuth } from '@/utils/restrictedAuth';

const DynamicAdminJourney = dynamic(() => import('@/journeys/auth/ForgotPassword'), {
  ssr: false,
});

function ForgotPassword() {
  return (
    <>
      <Head>
        <title>{getMetaDataTitle('Forgot Password')}</title>
      </Head>
      <Layout>
        <DynamicAdminJourney />
      </Layout>
    </>
  );
}

export default restrictedAuth(ForgotPassword);
