import * as yup from 'yup';

const phoneRegExp = /^(?!0)[1-9][0-9]{9}$/;

const phoneNumberSchema = yup
  .string()
  .required('Please enter your phone number. This field cannot be left empty.')
  .matches(phoneRegExp, 'The phone number you entered is invalid. Please check and try again.')
  .min(10, 'Your phone number is too short. It should be 10 digits long.')
  .max(10, 'Your phone number is too long. It should be exactly 10 digits.');

const emailSchema = yup
  .string()
  .email('The email address you entered is not valid. Please enter a valid email.')
  .required('We need your email address to proceed. Please provide it.');

const passWordSchema = yup
  .string()
  .required('Please enter your password. This field cannot be left empty.')
  .min(8, 'Your password is too short. It must be at least 8 characters long.')
  .matches(/[A-Z]/, 'Your password must include at least one uppercase letter.')
  .matches(/[a-z]/, 'Your password must include at least one lowercase letter.')
  .matches(/\d/, 'Your password must include at least one number.')
  .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Your password must include at least one special character.');

export const commonSchemas = {
  phone: phoneNumberSchema,
  email: emailSchema,
  password: passWordSchema,
};
