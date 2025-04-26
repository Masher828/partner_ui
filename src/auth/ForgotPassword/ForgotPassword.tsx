import DynamicForm from '@/dynamicForms';
import { FieldConfig } from '@/dynamicForms/DynamicForm';
import * as yup from 'yup';
import { Box, Heading, Stack, Text, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { useState } from 'react';
import { sendForgotPassMail } from '@/api/authService';

const initialValues = {
  emailId: '',
};
const fieldConfigs: FieldConfig[] = [
  {
    name: 'emailId',
    label: 'Email',
    type: 'email',
    validation: yup
      .string()
      .email('Please enter a valid email address. It should look like example@domain.com.')
      .required('We need your email address to contact you. Please provide it.'),
    placeholder: 'e.g., example@domain.com',
  },
];

export default function Component() {
  const [isSuccss, setIsSucess] = useState(false);
  const toast = useToast();
  const mutation = useMutation({
    mutationFn: sendForgotPassMail,
    onSuccess: () => {
      setIsSucess(true);
    },
    onError(error) {
      setIsSucess(false);
      toast({
        title: 'OOPS! Something went wrong',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = async (email: string) => {
    mutation.mutate(email);
  };

  return (
    <Box minH='60vh' display='flex' alignItems='center' justifyContent='center'>
      <Box mx='auto' maxW='md' py={10}>
        <Stack spacing={6}>
          <Stack spacing={2} textAlign='center'>
            <Heading as='h1' size='lg' fontWeight='bold'>
              Forgot Password
            </Heading>
            <Text color='gray.500'>Enter your email below to reset your password.</Text>
          </Stack>
          <Stack spacing={4}>
            <DynamicForm
              onSubmit={handleSubmit}
              fields={fieldConfigs}
              initialValues={initialValues}
              isLoading={mutation.isPending}
              colorScheme='blue'
              isFullWidth
              buttonText='Send'
              isDisabled={isSuccss}
            />
            {isSuccss ? (
              <Box textAlign='center'>
                <Text color='green.500'>
                  &#x2705; If a matching account was found, an email has been sent with instructions
                  to reset your password.
                </Text>
              </Box>
            ) : null}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
