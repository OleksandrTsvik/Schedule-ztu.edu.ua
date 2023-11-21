import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useColorModeValue,
} from '@chakra-ui/react';

import numberToEnglishDay from '../../utils/helpers/numberToEnglishDay';
import mutationWithToast from '../../utils/helpers/mutationWithToast';
import { ScheduleSubject } from '../../models/schedule.interface';
import { useToggleShowSubjectByIdMutation } from '../../services/schedule.api';

interface Props {
  subjects: ScheduleSubject[];
}

export default function SubjectsTable({ subjects }: Props) {
  const [toggleShowSubjectById] = useToggleShowSubjectByIdMutation();
  const bgShowedSubject = useColorModeValue('gray.300', 'blackAlpha.600');

  async function handleToggleShowSubjectById(subject: ScheduleSubject) {
    await mutationWithToast({
      mutation: toggleShowSubjectById,
      argument: {
        id: subject.id,
        show: !subject.show,
      },
    });
  }

  return (
    <TableContainer>
      <Table whiteSpace="normal">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Time</Th>
            <Th>Subject</Th>
            <Th>Teachers</Th>
            <Th>Classroom</Th>
            <Th>Weekday</Th>
            <Th>Week</Th>
            <Th>Groups</Th>
          </Tr>
        </Thead>
        <Tbody>
          {subjects.map((subject, index) => (
            <Tr
              key={subject.id}
              cursor="pointer"
              bg={subject.show ? bgShowedSubject : undefined}
              onClick={() => handleToggleShowSubjectById(subject)}
            >
              <Td>{index + 1}</Td>
              <Td>{subject.time}</Td>
              <Td>{subject.subject}</Td>
              <Td>{subject.teachers.join(', ')}</Td>
              <Td>{subject.classroom}</Td>
              <Td>{numberToEnglishDay(subject.weekday)}</Td>
              <Td>{subject.week}</Td>
              <Td>{subject.groups.join(', ')}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
