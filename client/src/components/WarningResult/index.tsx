import { WarningTwoIcon } from '@chakra-ui/icons';
import { Box, Heading } from '@chakra-ui/react';

interface Props {
  title?: React.ReactNode;
  text?: React.ReactNode;
}

export default function WarningResult({
  title = 'Oops, something went wrong',
  text,
}: Props) {
  return (
    <Box textAlign="center" py={10} px={6}>
      <WarningTwoIcon boxSize="50px" color="orange.300" />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {title}
      </Heading>
      {text && <Box color="gray.500">{text}</Box>}
    </Box>
  );
}
