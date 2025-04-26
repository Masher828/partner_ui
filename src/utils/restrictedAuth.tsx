import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const restrictedAuth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent: React.FC = (props: any) => {
    const { status } = useSession();
    const router = useRouter();

    const isAuthenticated = status === 'authenticated';
    useEffect(() => {
      if (status === 'authenticated') {
        router.push('/');
      }
    }, [router, status]);

    return !isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};
