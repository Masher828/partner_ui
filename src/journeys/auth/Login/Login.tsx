'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Heading,
  Stack,
  Image,
  useToast,
  Box,
  Link as ChakraLink,
} from '@chakra-ui/react';
import * as yup from 'yup';
import { useSession, signIn } from 'next-auth/react';
import { useRouter as nextRouter } from 'next/router';
import DynamicForm, { FieldConfig } from '@/dynamicForms/DynamicForm';
import Link from 'next/link';

interface SignInProps {
  email: string;
  password: string;
}

const initialValues = {
  email: '',
  password: '',
};

const fieldConfigs: FieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    validation: yup
      .string()
      .email('Please enter a valid email address. It should look like example@domain.com.')
      .required('We need your email address to proceed. Please enter it.'),
    placeholder: 'e.g., example@domain.com',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    validation: yup
      .string()
      .required('A password is required for secure authentication.')
      .min(2, ''),
    placeholder: 'Enter a secure password',
  },
];

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { status } = useSession();
  const nextRoute = nextRouter();
  let goto = '';

  if (typeof nextRoute.query.goto === 'string') {
    goto = nextRoute.query.goto;
  } else if (Array.isArray(nextRoute.query.goto)) {
    goto = nextRoute.query.goto.join(',');
  }

  useEffect(() => {
    if (status === 'authenticated') {
      nextRoute.back();
    }
  }, [nextRoute, status]);

  const handleSubmit = async (data: SignInProps) => {
    setIsLoading(true);

    signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
      .then((data) => {
        if (!data?.ok) {
          toast({
            title: 'Something went wrong',
            description: 'Please check your credentails once',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } else {
          const callbackUrl = goto ? goto : `${window.location.origin}`;
          window.location.href = callbackUrl;
        }
      })
      .catch(() => {
        toast({
          title: 'Something went wrong',
          description: 'Please check your network connections and try again',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Stack minH={'70vh'} p={5} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Sign in to your account </Heading>
          <DynamicForm
            onSubmit={handleSubmit}
            fields={fieldConfigs}
            initialValues={initialValues}
            isLoading={isLoading}
            colorScheme='green'
            isFullWidth
            buttonText='Sign In'
          />

          <Button
            colorScheme={'blue'}
            variant={'solid'}
            onClick={() =>
              nextRoute.push(`/auth/signup${goto ? '?goto=' + encodeURIComponent(goto) : ''}`)
            }
          >
            Sign up
          </Button>
          <Box>
            <ChakraLink>
              <Link href={'/auth/forgot-password'}>Forgot password?</Link>
            </ChakraLink>
          </Box>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          borderRadius='lg'
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  );
}
