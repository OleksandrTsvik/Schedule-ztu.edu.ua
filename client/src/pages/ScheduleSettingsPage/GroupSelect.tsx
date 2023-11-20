import { useMemo } from 'react';
import { Box, Flex, IconButton, Tag, Tooltip } from '@chakra-ui/react';
import { FaRedo } from 'react-icons/fa';

import { FormikSelect } from '../../components';
import { GroupType } from '../../components/FormikSelect/types';
import {
  useGetGroupsQuery,
  useLoadGroupsMutation,
} from '../../services/group.api';

export default function GroupSelect() {
  const { data: groups, isFetching } = useGetGroupsQuery();
  const [loadGroups, { isLoading }] = useLoadGroupsMutation();

  const selectOptions: GroupType[] = useMemo(() => {
    if (!groups) {
      return [];
    }

    return groups.map((faculty) => ({
      label: faculty.name,
      options: faculty.groups.map((group) => ({
        value: group.name,
        label: group.name,
      })),
    }));
  }, [groups]);

  return (
    <Flex alignItems="flex-end" gap={2}>
      <FormikSelect
        name="scheduleForGroup"
        label="Group"
        isLoading={isFetching || isLoading}
        options={selectOptions}
        formatGroupLabel={(data) => (
          <Flex alignItems="flex-start" justifyContent="space-between" gap={2}>
            <Box>{data.label}</Box>
            <Tag colorScheme="blue">{data.options.length}</Tag>
          </Flex>
        )}
      />
      <Tooltip label="Refresh the group list">
        <IconButton
          aria-label="Load groups"
          variant="outline"
          isLoading={isLoading}
          icon={<FaRedo />}
          onClick={() => loadGroups().unwrap()}
        />
      </Tooltip>
    </Flex>
  );
}
