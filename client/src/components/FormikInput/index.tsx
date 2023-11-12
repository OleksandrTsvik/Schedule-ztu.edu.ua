import { useField } from 'formik';
import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormLabel,
  FormLabelProps,
  Input,
  InputProps,
} from '@chakra-ui/react';

interface Props extends InputProps {
  name: string;
  label?: string;
  controlProps?: FormControlProps;
  labelProps?: FormLabelProps;
  errorProps?: FormErrorMessageProps;
}

export default function FormikInput({
  name,
  label,
  controlProps,
  labelProps,
  errorProps,
  ...props
}: Props) {
  const [field, meta] = useField(name);

  return (
    <FormControl {...controlProps} isInvalid={meta.touched && !!meta.error}>
      {label && <FormLabel {...labelProps}>{label}</FormLabel>}
      <Input {...props} {...field} />
      <FormErrorMessage {...errorProps}>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
