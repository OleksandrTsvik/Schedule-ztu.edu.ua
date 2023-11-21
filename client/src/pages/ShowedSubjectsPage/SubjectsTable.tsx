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
import { useToggleShowScheduleSubjectMutation } from '../../services/schedule.api';

interface Props {
  subjects: ScheduleSubject[];
}

export default function SubjectsTable({ subjects }: Props) {
  const [toggleShowScheduleSubject] = useToggleShowScheduleSubjectMutation();
  const bgShowedSubject = useColorModeValue('gray.400', 'blackAlpha.600');

  async function handleToggleShowScheduleSubject(subject: ScheduleSubject) {
    await mutationWithToast({
      mutation: toggleShowScheduleSubject,
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
              bg={subject.show ? bgShowedSubject : undefined}
              onClick={() => handleToggleShowScheduleSubject(subject)}
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
