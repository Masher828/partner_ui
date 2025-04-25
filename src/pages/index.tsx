import React from 'react';
import Head from 'next/head';
import { getMetaDataTitle } from '@/utils/getMetaDataTitle';
import Layout from '@/components/Layout';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>{getMetaDataTitle('Home')}</title>
        <meta name='description' content='Find your gaming buddys' />
        <meta name='robots' content='index, follow' />
        <meta property='og:title' content={getMetaDataTitle('Home')} />
        <meta property='og:description' content='Find your gaming buddys' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://yourwebsite.com/home' />
        <meta property='og:image' content='https://yourwebsite.com/og-image.jpg' />
      </Head>
      <Layout>Hi</Layout>
    </>
  );
}
