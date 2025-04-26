import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ResetPassword from '../ResetPassword';
import { decrypt } from '@/utils/decrypt';

const AuthActions = () => {
  const queryParams = useSearchParams();
  const [activeState, setActiveState] = useState<'Loading' | 'SetPassword' | 'Error'>('Loading');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    try {
      const query = queryParams.get('q');
      // const decryptedQuery = decrypt(query || '', 'abcdef');
      const decryptedQuery = atob(query || '');
      if (typeof decryptedQuery === 'string') {
        const parsedQuery = JSON.parse(decryptedQuery);
        if (
          parsedQuery?.a === 'rst_pwd' &&
          parsedQuery.t != undefined &&
          parsedQuery.e != undefined
        ) {
          setToken(parsedQuery.t);
          setEmail(parsedQuery.e);
          setActiveState('SetPassword');
        } else {
          setActiveState('Error');
          setToken('');
        }
      } else {
        setActiveState('Error');
      }
    } catch {
      setActiveState('Error');
    }
  }, [queryParams]);

  const getRenderedComponent = () => {
    if (activeState === 'SetPassword') {
      return <ResetPassword token={token} email={email} />;
    }
    if (activeState === 'Error') {
      // TODO: Add Error Screen
      // return <ErrorScreen />;
    }
    return <>Loading</>;
  };

  return <div>{getRenderedComponent()}</div>;
};

export default AuthActions;
