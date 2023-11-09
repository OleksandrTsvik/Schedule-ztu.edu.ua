import { Flex } from '@chakra-ui/react';

interface Props {
  children?: React.ReactNode;
}

export default function Wrapper({ children }: Props) {
  return (
    <Flex minHeight="100vh" direction="column">
      {children}
    </Flex>
  );
}
