import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

import getErrorObject from '../../utils/helpers/getErrorObject';
import ErrorMessage from '../ErrorMessage';

interface Props {
  error?: FetchBaseQueryError | SerializedError;
  title?: string;
  text?: string;
}

export default function ErrorResult({
  error,
  title = 'Oops, something went wrong',
  text,
}: Props) {
  const errorObject = getErrorObject(error);

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
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {errorObject.message || title}
      </Heading>
      <Box color="gray.500">
        {<ErrorMessage message={errorObject.description} /> || text}
      </Box>
    </Box>
  );
}
