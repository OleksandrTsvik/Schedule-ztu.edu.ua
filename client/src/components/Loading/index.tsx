import { Box, BoxProps, Spinner, SpinnerProps } from '@chakra-ui/react';

interface Props extends SpinnerProps {
  text?: string;
  boxProps?: BoxProps;
}

export default function Loading({
  text = 'Loading...',
  boxProps,
  size = 'xl',
  ...props
}: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      {...boxProps}
    >
      <Spinner {...props} size={size} />
      {text && <Box mt={3}>{text}</Box>}
    </Box>
  );
}
