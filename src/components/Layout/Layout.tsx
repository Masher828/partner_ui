import React, { ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { ChakraProvider } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

const Layout = ({ children, hideNavbar = false, hideFooter = false }: Props) => {
  return (
    <div>
      <ChakraProvider>
        {!hideNavbar ? <Navbar /> : null}
        <div style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</div>

        {!hideFooter ? <Footer /> : null}
      </ChakraProvider>
    </div>
  );
};

export default Layout;
