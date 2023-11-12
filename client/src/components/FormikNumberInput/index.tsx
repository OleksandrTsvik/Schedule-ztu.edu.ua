import { useField } from 'formik';
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputProps,
  FormControlProps,
  FormErrorMessageProps,
  FormErrorMessage,
  FormLabelProps,
} from '@chakra-ui/react';

interface Props extends NumberInputProps {
  name: string;
  label?: string;
  controlProps?: FormControlProps;
  labelProps?: FormLabelProps;
  errorProps?: FormErrorMessageProps;
}

export default function FormikNumberInput({
  name,
  label,
  controlProps,
  labelProps,
  errorProps,
  ...props
}: Props) {
  const [field, meta, helpers] = useField(name);

  return (
    <FormControl {...controlProps} isInvalid={meta.touched && !!meta.error}>
      <FormLabel {...labelProps}>{label}</FormLabel>
      <NumberInput
        {...props}
        {...field}
        value={field.value}
        onChange={(_, valueNumber) => helpers.setValue(valueNumber)}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <FormErrorMessage {...errorProps}>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
