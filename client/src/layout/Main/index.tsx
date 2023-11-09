import { Flex } from '@chakra-ui/react';

interface Props {
  children?: React.ReactNode;
}

export default function Main({ children }: Props) {
  return (
    <Flex grow={1} py="3" px="4">
      {children}
    </Flex>
  );
}
