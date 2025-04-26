import React, { ReactNode } from 'react';
import Navbar from '../Navbar';
import { ChakraProvider } from '@chakra-ui/react';
import Footer from '../Footer';
import AuthModal from '../AuthModal';

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
        {children}
        {!hideFooter ? <Footer /> : null}
        <AuthModal />
      </ChakraProvider>
    </div>
  );
};

export default Layout;
