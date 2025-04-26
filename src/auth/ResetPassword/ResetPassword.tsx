import DynamicForm from '@/dynamicForms';
import { Box, Stack, Heading, Text, useToast } from '@chakra-ui/react';
import * as yup from 'yup';
import React from 'react';
import { commonSchemas, FieldConfig } from '@/dynamicForms/DynamicForm';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { resetPassword, ResetPasswordData } from '@/api/authService';
import { getErrorMessage } from '@/utils/getErrorMessage';

const initialValues = {
  password: '',
  cpassword: '',
};

const fieldConfigs: FieldConfig[] = [
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    validation: commonSchemas.password,
    placeholder: 'Create a secure password',
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

const ResetPassword = ({ token, email }: { token: string; email: string }) => {
  const toast = useToast();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast({
        title: 'Operation Successful',
        description: 'You will be redirected to the sign-in page.',
        status: 'success',
        duration: 1000,
        isClosable: true,
      });

      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
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
  });

  const handleSubmit = async (data: ResetPasswordData) => {
    const resData: ResetPasswordData = {
      password: data?.password,
      resetToken: token,
      emailId: email,
    };
    await mutation.mutate(resData);
  };

  return (
    <Box minH='60vh' display='flex' alignItems='center' justifyContent='center'>
      <Box mx='auto' maxW='md' py={10}>
        <Stack spacing={6}>
          <Stack spacing={2} textAlign='center'>
            <Heading as='h1' size='lg' fontWeight='bold'>
              Reset Password
            </Heading>
            <Text color='gray.500'>
              Enter your new password below to reset your account password.
            </Text>
          </Stack>
          <Stack spacing={4}>
            <DynamicForm
              onSubmit={handleSubmit}
              fields={fieldConfigs}
              initialValues={initialValues}
              isLoading={mutation.isPending}
              colorScheme='blue'
              isFullWidth
              buttonText='Reset Password'
            />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default ResetPassword;
