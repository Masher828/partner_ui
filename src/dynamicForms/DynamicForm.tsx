// @ts-nocheck
// Disabling ts as build failing
// TO-DO fix ts issue

import React, { useRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createValidationSchema } from './validation/validationSchema';
import { commonSchemas } from './CommonSchemas';
import { PiEyeClosedDuotone, PiEyeDuotone } from 'react-icons/pi';
import * as yup from 'yup';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  FormErrorMessage,
  Box,
  Select,
  InputRightElement,
  InputLeftElement,
  InputGroup,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

export { commonSchemas };

export interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'select' | 'tel' | 'number' | 'textarea' | string;
  validation?: yup.AnySchema;
  options?: { value: string; label: string }[];
  placeholder?: string;
  icon?: React.ReactElement | IconType;
  onChange?: (value: string) => void;
  isFieldDisabled?: boolean;
}

const FIELDS_PADDING = 4;

export interface DynamicFormHandles {
  customSubmitHandler: () => void;
}

type FormProps = {
  onSubmit: (data: any) => void;
  fields: FieldConfig[];
  initialValues?: any;
  isLoading?: boolean;
  colorScheme?: 'green' | 'blue' | 'red';
  isFullWidth?: boolean;
  buttonText?: string;
  isCustomSubmitEnabled?: boolean;
  isminscreen?: boolean;
  onDataChange?: (isModified: boolean) => void;
  addExtraSpace?: boolean;
  isDisabled?: boolean;
  isViewOnly?: boolean;
  preSubmissionAlert?: string;
};

// eslint-disable-next-line react/display-name
const DynamicForm = React.forwardRef<DynamicFormHandles, FormProps>(
  (
    {
      onSubmit,
      fields,
      initialValues,
      isLoading,
      colorScheme,
      isFullWidth,
      buttonText,
      isCustomSubmitEnabled,
      isminscreen = false,
      onDataChange,
      addExtraSpace = false,
      isDisabled = false,
      isViewOnly = false,
      preSubmissionAlert,
    },
    ref,
  ) => {
    const schema = createValidationSchema(fields);
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => ({
      customSubmitHandler: () => {
        if (formRef.current) {
          formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        } else {
          console.error('Form ref is not available');
        }
      },
    }));

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
      watch,
    } = useForm({
      defaultValues: initialValues || {},
      resolver: yupResolver(schema),
    });

    const watchedValues = watch();
    const [showPassword, updateShowPassword] = React.useState(false);

    useEffect(() => {
      const isModified = JSON.stringify(watchedValues) !== JSON.stringify(initialValues);

      if (onDataChange) {
        onDataChange(isModified);
      }
    }, [watchedValues, initialValues, onDataChange]);

    const handleBlur = (name: string, value: string) => {
      setValue(name, value.trim(), { shouldValidate: true });
    };

    const handleChange = (field: FieldConfig, value: string) => {
      setValue(field.name, value, { shouldValidate: true });
      if (field.onChange) {
        field.onChange(value);
      }
    };

    const renderIcon = (icon) => {
      if (React.isValidElement(icon)) {
        return icon;
      }
      if (typeof icon === 'function') {
        const IconComponent = icon as IconType;
        return <IconComponent />;
      }
      return null;
    };

    const showSubmitButton = !(isCustomSubmitEnabled || isViewOnly);

    const renderField = (field: FieldConfig): React.ReactElement => {
      const {
        name,
        label,
        type = 'text',
        options,
        placeholder,
        icon,
        isFieldDisabled = false,
      } = field;
      const isRequired =
        field.validation &&
        field.validation.describe().tests.some((test) => test.name === 'required');
      const labelWithAsterisk = isRequired ? `${label} *` : label;

      switch (type) {
        case 'text':
        case 'email':
        case 'tel':
        case 'number':
          return (
            <FormControl pt={FIELDS_PADDING} key={name} isInvalid={!!errors[name]}>
              <FormLabel htmlFor={name}>{labelWithAsterisk}</FormLabel>
              <InputGroup>
                {icon && <InputLeftElement>{renderIcon(icon)}</InputLeftElement>}
                <Input
                  {...register(name)}
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  onBlur={(e) => handleBlur(name, e.target.value)}
                  onChange={(e) => handleChange(field, e.target.value)}
                  isDisabled={isFieldDisabled}
                  isReadOnly={isViewOnly}
                  variant={isViewOnly ? 'flushed' : null}
                />
              </InputGroup>
              <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
            </FormControl>
          );
        case 'password':
          return (
            <FormControl pt={FIELDS_PADDING} key={name} isInvalid={!!errors[name]}>
              <FormLabel htmlFor={name}>{labelWithAsterisk}</FormLabel>
              <InputGroup>
                {icon && <InputLeftElement>{icon}</InputLeftElement>}
                <Input
                  {...register(name)}
                  id={name}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={placeholder}
                  onBlur={(e) => handleBlur(name, e.target.value)}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
                <InputRightElement mr={2}>
                  <Button h='1.75rem' size='sm' onClick={() => updateShowPassword(!showPassword)}>
                    {showPassword ? <PiEyeDuotone /> : <PiEyeClosedDuotone />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
            </FormControl>
          );
        case 'select':
          return (
            <FormControl pt={FIELDS_PADDING} key={name} isInvalid={!!errors[name]}>
              <FormLabel htmlFor={name}>{labelWithAsterisk}</FormLabel>
              <Select
                {...register(name)}
                id={name}
                placeholder={placeholder}
                onChange={(e) => handleChange(field, e.target.value)}
              >
                {options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
            </FormControl>
          );
        case 'textarea':
          return (
            <FormControl pt={FIELDS_PADDING} key={name} isInvalid={!!errors[name]}>
              <FormLabel htmlFor={name}>{labelWithAsterisk}</FormLabel>
              <Textarea
                {...register(name)}
                id={name}
                placeholder={placeholder}
                onBlur={(e) => handleBlur(name, e.target.value)}
                onChange={(e) => handleChange(field, e.target.value)}
              />
              <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
            </FormControl>
          );
        default:
          return <></>;
      }
    };

    return (
      <Box as='form' onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        {isminscreen ? (
          <SimpleGrid columns={2} spacing={FIELDS_PADDING}>
            {fields.map((field, index) => (
              <Box key={field.name} gridColumn={index % 2 === 0 ? 1 : 2}>
                {renderField(field)}
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          fields.map(renderField)
        )}
        {preSubmissionAlert ? (
          <Alert status='warning' mt={4}>
            <AlertIcon />
            <AlertTitle>Alert!</AlertTitle>
            <AlertDescription>{preSubmissionAlert}</AlertDescription>
          </Alert>
        ) : null}
        {showSubmitButton ? (
          <Button
            mt={addExtraSpace ? 8 : 4}
            type='submit'
            isLoading={isLoading}
            colorScheme={colorScheme}
            variant='solid'
            width={isFullWidth ? '100%' : 'auto'}
            isDisabled={isDisabled}
          >
            {buttonText || 'Submit'}
          </Button>
        ) : null}
      </Box>
    );
  },
);

export default DynamicForm;
