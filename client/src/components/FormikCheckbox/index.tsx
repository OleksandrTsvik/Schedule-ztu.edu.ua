import { useField } from 'formik';
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
} from '@chakra-ui/react';

interface Props extends CheckboxProps {
  name: string;
  label?: string;
  controlProps?: FormControlProps;
  errorProps?: FormErrorMessageProps;
}

export default function FormikCheckbox({
  name,
  label,
  controlProps,
  errorProps,
  ...props
}: Props) {
  const [field, meta] = useField(name);

  return (
    <FormControl {...controlProps} isInvalid={meta.touched && !!meta.error}>
      <Checkbox {...props} {...field} isChecked={field.value}>
        {label}
      </Checkbox>
      <FormErrorMessage {...errorProps}>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
