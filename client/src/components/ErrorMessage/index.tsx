import { Box, BoxProps } from '@chakra-ui/react';

interface Props {
  message?: string | string[];
  boxProps?: BoxProps;
}

export default function ErrorMessage({ message, boxProps }: Props) {
  if (!message) {
    return null;
  }

  if (typeof message === 'string') {
    return <Box {...boxProps}>{message}</Box>;
  }

  return (
    <>
      {message.map((message, index) => (
        <Box key={index} {...boxProps}>
          {message}
        </Box>
      ))}
    </>
  );
}
