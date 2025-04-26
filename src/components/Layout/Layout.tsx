import React, { ReactNode } from 'react';
import Navbar from '../Navbar';
import { ChakraProvider } from '@chakra-ui/react';
import Footer from '../Footer';
import AuthModal from '../AuthModal';
import { SessionProvider } from 'next-auth/react';

interface Props {
  children: ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

const Layout = ({ children, hideNavbar = false, hideFooter = false }: Props) => {
  return (
    <div>
      <SessionProvider refetchOnWindowFocus={false}>
        <ChakraProvider>
          {!hideNavbar ? <Navbar /> : null}
          <div style={{ padding: '20px', minHeight: 'calc(100vh - 200px)' }}>{children}</div>
          {!hideFooter ? <Footer /> : null}
          <AuthModal />
        </ChakraProvider>
      </SessionProvider>
    </div>
  );
};

export default Layout;
