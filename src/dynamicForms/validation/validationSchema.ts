import * as yup from 'yup';

interface FieldConfigWithValidation {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | string; // Allow custom types
  validation?: yup.AnySchema; // Optional validation schema for each field
}

export const createValidationSchema = (fields: FieldConfigWithValidation[]) => {
  const shape: { [key: string]: yup.AnySchema } = fields.reduce(
    (acc, field) => {
      acc[field.name] = field.validation || yup.string();
      return acc;
    },
    {} as { [key: string]: yup.AnySchema },
  );

  return yup.object().shape(shape);
};
