import React from 'react';
import { Html, Main, Head, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='icon' href='./assets/favicon.png' />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
