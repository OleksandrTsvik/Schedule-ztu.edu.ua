import { Box, Flex, Heading, Progress } from '@chakra-ui/react';

import { useGetDisplayPercentageQuery } from '../../services/schedule.api';

export default function DisplayPercentage() {
  const { data, isFetching } = useGetDisplayPercentageQuery();

  return (
    <Box>
      <Heading as="h4" size="md" mb={2}>
        Percentage of displayed subjects
      </Heading>
      {isFetching ? (
        <Progress isIndeterminate colorScheme="green" size="lg" />
      ) : (
        <Flex alignItems="center" justifyContent="space-between" gap={2}>
          <Progress
            colorScheme="green"
            size="lg"
            width="100%"
            value={data?.percentage}
          />
          <Box>{data?.percentage}%</Box>
        </Flex>
      )}
    </Box>
  );
}
