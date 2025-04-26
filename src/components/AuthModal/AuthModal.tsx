import useAuthModalStore from '@/zustand/authModalStore';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import React, { FormEventHandler, useState } from 'react';

const AuthModal = () => {
  const { isOpen, closeModal } = useAuthModalStore();
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, updateShowPassword] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    signIn('credentials', {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false,
    })
      .then((data) => {
        if (!data?.ok) {
          setIsLoginFailed(true);
        } else {
          setIsLoginFailed(false);
          closeModal();
        }
      })
      .catch(() => {
        setIsLoginFailed(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal onClose={closeModal} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>It Looks like your session expired, please sign in again.</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoginFailed ? (
            <>
              <Alert status='error'>
                <AlertIcon />
                <AlertTitle>Sign-in Failed, please try again!</AlertTitle>
              </Alert>
              <br />
            </>
          ) : null}
          <form onSubmit={handleSubmit}>
            <FormControl id='email'>
              <FormLabel>Email address</FormLabel>
              <Input
                type='email'
                value={userInfo.email}
                onChange={({ target }) => setUserInfo({ ...userInfo, email: target.value })}
              />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={userInfo.password}
                  onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })}
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={() => updateShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Checkbox>Remember me</Checkbox>
                <Text color={'blue.500'}>Forgot password?</Text>
              </Stack>
              <Button isLoading={isLoading} colorScheme={'blue'} variant={'solid'} type='submit'>
                Sign in
              </Button>
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
