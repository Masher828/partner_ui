import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { getMetaDataTitle } from '@/utils/getMetaDataTitle';
import Layout from '@/components/Layout';

const DynamicAdminJourney = dynamic(() => import('@/components/AboutUs'), {
  ssr: false,
});

function About() {
  return (
    <>
      <Head>
        <title>{getMetaDataTitle('About')}</title>
      </Head>
      <Layout>
        <DynamicAdminJourney />
      </Layout>
    </>
  );
}

export default About;
