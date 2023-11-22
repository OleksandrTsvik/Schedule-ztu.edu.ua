import { useState } from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormLabel,
  FormLabelProps,
  IconButton,
  IconButtonProps,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons';

interface Props extends InputProps {
  name: string;
  label?: React.ReactNode;
  controlProps?: FormControlProps;
  labelProps?: FormLabelProps;
  iconButtonProps?: IconButtonProps;
  errorProps?: FormErrorMessageProps;
}

export default function FormikPasswordInput({
  name,
  label,
  controlProps,
  labelProps,
  iconButtonProps,
  errorProps,
  ...props
}: Props) {
  const [show, setShow] = useState(false);
  const [field, meta] = useField(name);

  function handleClick() {
    setShow(!show);
  }

  return (
    <FormControl {...controlProps} isInvalid={meta.touched && !!meta.error}>
      {label && <FormLabel {...labelProps}>{label}</FormLabel>}
      <InputGroup>
        <Input {...props} {...field} type={show ? 'text' : 'password'} />
        <InputRightElement>
          <IconButton
            variant="ghost"
            _hover={{ bgColor: 'transparent' }}
            {...iconButtonProps}
            aria-label={show ? 'Hide password' : 'Show password'}
            icon={show ? <ViewIcon /> : <ViewOffIcon />}
            onClick={handleClick}
          />
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage {...errorProps}>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
