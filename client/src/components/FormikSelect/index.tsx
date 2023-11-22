import { useField } from 'formik';
import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormLabel,
  FormLabelProps,
} from '@chakra-ui/react';
import { OptionsOrGroups, PropsValue, Select } from 'chakra-react-select';

import { OptionType, ChakraReactSelectProps } from './types';

import type { GroupBase } from 'react-select';

export type FormikSelectProps = ChakraReactSelectProps & {
  name: string;
  label?: React.ReactNode;
  controlProps?: FormControlProps;
  labelProps?: FormLabelProps;
  errorProps?: FormErrorMessageProps;
};

export default function FormikSelect({
  name,
  label,
  controlProps,
  labelProps,
  errorProps,
  ...props
}: FormikSelectProps) {
  const [field, meta, helpers] = useField(name);

  function selectValue(
    options: OptionsOrGroups<OptionType, GroupBase<OptionType>> | undefined,
  ): PropsValue<OptionType> | undefined {
    if (!options) {
      return;
    }

    for (const option of options) {
      if ('options' in option) {
        const foundDefaultValue = selectValue(option.options);

        if (foundDefaultValue) {
          return foundDefaultValue;
        }
      } else if (option.value === field.value) {
        return option;
      }
    }

    return;
  }

  return (
    <FormControl {...controlProps} isInvalid={meta.touched && !!meta.error}>
      {label && <FormLabel {...labelProps}>{label}</FormLabel>}
      <Select
        {...props}
        {...field}
        value={selectValue(props.options)}
        onChange={(option) => helpers.setValue(option?.value)}
      />
      <FormErrorMessage {...errorProps}>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
