import useAuthModalStore from '@/zustand/authModalStore';
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const baseURL = "http://localhost:3033";

let cachedSession: any = null; // Cache session in memory

const ApiClient = () => {
  const defaultOptions = {
    baseURL,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    if (!cachedSession) {
      cachedSession = await getSession();
    }

    if (cachedSession && isSessionExpired(cachedSession)) {
      cachedSession = null;
      signOut({ redirect: false });
      useAuthModalStore.getState().openModal();
    }

    if (cachedSession) {
      request.headers.Authorization = `Bearer ${cachedSession.access_token}`;
    }

    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      try {
        const { status } = error.response;

        switch (status) {
          case 401:
            // Handle unauthorized (session expired or invalid)
            cachedSession = null; // Clear cached session
            signOut({ redirect: false }); // Sign out
            useAuthModalStore.getState().openModal(); // Open login modal
            break;
          default:
            break;
        }
        return Promise.reject(error);
      } catch (e) {
        return Promise.reject(error);
      }
    },
  );

  return instance;
};

const isSessionExpired = (session: any) => {
  if (!session?.expires) return false;
  const expirationTime = new Date(session.expires).getTime();
  const currentTime = new Date().getTime();
  return currentTime > expirationTime;
};

export default ApiClient();
