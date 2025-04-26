import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { getMetaDataTitle } from '@/utils/getMetaDataTitle';
import { restrictedAuth } from '@/utils/restrictedAuth';
import Layout from '@/components/Layout';

const DynamicAdminJourney = dynamic(() => import('@/journeys/auth/SignUp'), {
  ssr: false,
});

function Signup() {
  return (
    <>
      <Head>
        <title>{getMetaDataTitle('Signup')}</title>
      </Head>
      <Layout>
        <DynamicAdminJourney />
      </Layout>
    </>
  );
}

export default Signup;
