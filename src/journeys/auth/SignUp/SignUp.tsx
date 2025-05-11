import DynamicForm from '@/dynamicForms';
import { FieldConfig, commonSchemas } from '@/dynamicForms/DynamicForm';
import { Flex, Heading, Stack, useToast, Divider, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import * as yup from 'yup';
import { SignUpProps } from '@/types/sign-up-type';
import { useMutation } from '@tanstack/react-query';
import { signUpUser } from '@/api/authService';
import { useRouter } from 'next/router';
import { getErrorMessage } from '@/utils/getErrorMessage';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

const redirectOnSignup = false;

const initialValues = {
  firstName: '',
  email: '',
};

const fieldConfigs: FieldConfig[] = [
  {
    name: 'user_name',
    label: 'Username',
    type: 'text',
    validation: yup
      .string()
      .required('Please enter unique username. This field cannot be left empty.')
      .min(5, 'First name is too short. It should be at least 5 characters long.')
      .max(50, 'First name is too long. It should be no more than 50 characters.'),
    placeholder: 'John Doe',
  },
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    validation: yup
      .string()
      .required('Please enter your full name. This field cannot be left empty.')
      .min(2, 'Name is too short. It should be at least 2 characters long.')
      .max(50, 'Name is too long. It should be no more than 50 characters.'),
    placeholder: 'John Doe',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    validation: commonSchemas.email,
    placeholder: 'e.g., john@doe.com',
  },
  {
    name: 'mobile',
    label: 'Phone',
    type: 'tel',
    validation: commonSchemas.phone,
    placeholder: 'e.g., 9999999999',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    validation: commonSchemas.password,
    placeholder: 'Create a strong password',
  },
  {
    name: 'cpassword',
    label: 'Confirm Password',
    type: 'password',
    validation: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords do not match. Please re-enter your password.')
      .required('Please confirm your password.')
      .min(8, 'Confirm Password must be at least 8 characters long.'),
    placeholder: 'Re-enter your password',
  },
];

interface SignUpComponentProps {
  isModal?: boolean;
  onSignUpSuccess?: () => void;
}

const SignUp = ({ isModal, onSignUpSuccess }: SignUpComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const nextRoute = useRouter();
  let goto = '';

  if (typeof nextRoute.query.goto === 'string') {
    goto = nextRoute.query.goto;
  } else if (Array.isArray(nextRoute.query.goto)) {
    goto = nextRoute.query.goto.join(',');
  }

  const mutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (_, variables) => {
      if (onSignUpSuccess) {
        signIn('credentials', {
          email: variables.email,
          password: variables.password,
          redirect: false,
        }).then((data) => {
          if (!data?.ok) {
            toast({
              title: 'Something went wrong',
              description: 'Please check your credentails once',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          } else {
            onSignUpSuccess();
          }
        });
      } else {
        toast({
          title: 'Signup Successful',
          description: 'You are being signed in...',
          status: 'success',
          duration: 1000,
          isClosable: true,
        });

        if (redirectOnSignup) {
          router.push('/auth/login');
        } else {
          signIn('credentials', {
            email: variables.email,
            password: variables.password,
            redirect: false,
          }).then((data) => {
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
          });
        }
      }
    },
    onError(error) {
      toast({
        title: 'OOPS! Something went wrong',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    onSettled() {
      setIsLoading(false);
    },
  });

  const handleSubmit = async (data: SignUpProps) => {
    setIsLoading(true);
    const resData = {
      name: data?.name,
      user_name: data?.user_name,
      email: data?.email,
      mobile: data?.mobile,
      password: data?.password,
      mobile_code: data?.mobile_code,
      dob: data?.dob,
    };
    await mutation.mutate(resData);
  };
  return (
    <>
      <Stack minH={'70vh'} p={isModal ? 0 : 5} direction={{ base: 'column', md: 'row' }}>
        <Flex flex={1} align={'center'} justify={'center'} boxShadow={'2xl'}p={8} borderRadius='lg'>
          <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'} >Sign up </Heading>
            <DynamicForm
              onSubmit={handleSubmit}
              fields={fieldConfigs}
              initialValues={initialValues}
              colorScheme='green'
              isFullWidth
              isLoading={isLoading}
              buttonText='Sign Up'
            />
            <Divider />

            <Text fontSize='sm' color='gray.500'>
              By creating an account, you agree to RoomCheckInn{' '}
              <Link href='/terms-and-conditions' passHref>
                <Text as='u' cursor='pointer' color='blue.500'>
                  Terms of Use
                </Text>
              </Link>{' '}
              and{' '}
              <Link href='/privacy' passHref>
                <Text as='u' cursor='pointer' color='blue.500'>
                  Privacy Policy
                </Text>
              </Link>
              .
            </Text>
          </Stack>
        </Flex>
      </Stack>
    </>
  );
};

export default SignUp;
