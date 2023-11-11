import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

interface Props {
  title?: string;
  text?: string;
}

export default function ErrorResult({
  title = 'Oops, something went wrong',
  text,
}: Props) {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="red.500"
          rounded="50px"
          w="55px"
          h="55px"
        >
          <CloseIcon boxSize="20px" color="white" />
        </Flex>
      </Box>
      {title && (
        <Heading as="h2" size="xl" mt={6} mb={2}>
          {title}
        </Heading>
      )}
      {text && <Text color="gray.500">{text}</Text>}
    </Box>
  );
}
