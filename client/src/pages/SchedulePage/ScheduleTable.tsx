import {
  Box,
  Table,
  TableCellProps,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';

import numberToEnglishDay from '../../utils/helpers/numberToEnglishDay';
import { ScheduleDisplayedItem } from '../../models/schedule.interface';

interface Props {
  schedule: ScheduleDisplayedItem;
  activeWeekday?: number;
}

export default function SchedulePage({ schedule, activeWeekday }: Props) {
  const countDays = Object.values(schedule)[0].length;

  const propsCell: TableCellProps = {
    textAlign: 'center',
    px: 2,
    py: 2,
    borderWidth: 1,
    borderColor: useColorModeValue('blackAlpha.300', 'gray.700'),
  };

  const propsFirstColumn: TableCellProps = {
    ...propsCell,
    px: 1,
    backgroundColor: useColorModeValue('yellow.100', 'green.600'),
  };

  const propsTh: TableCellProps = {
    ...propsCell,
    width: `calc(100% / ${countDays})`,
    py: 3,
    color: 'white',
    backgroundColor: useColorModeValue('orange.500', 'blue.600'),
  };

  const propsLessonCell: TableCellProps = {
    ...propsCell,
    style: { whiteSpace: 'normal', wordBreak: 'break-word' },
  };

  const propsActiveTh: TableCellProps = {
    ...propsTh,
    backgroundColor: useColorModeValue('orange.600', 'blue.700'),
  };

  const propsActiveLessonCell: TableCellProps = {
    ...propsLessonCell,
    backgroundColor: useColorModeValue('purple.100', 'purple.700'),
  };

  const boxClassroomColor = useColorModeValue('blue.500', 'blue.400');
  const boxSubjectColor = useColorModeValue('blue.900', 'orange.500');

  function getPropsTh(index: number) {
    if (activeWeekday === index + 1) {
      return propsActiveTh;
    }

    return propsTh;
  }

  function getPropsLesson(index: number) {
    if (activeWeekday === index + 1) {
      return propsActiveLessonCell;
    }

    return propsLessonCell;
  }

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th {...propsFirstColumn}></Th>
            {Array(countDays)
              .fill(null)
              .map((_, index) => (
                <Th key={index} {...getPropsTh(index)}>
                  {numberToEnglishDay(index + 1)}
                </Th>
              ))}
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(schedule).map((time, index) => (
            <Tr key={time}>
              <Td {...propsFirstColumn}>{time}</Td>
              {schedule[time].map((lesson, index) => (
                <Td key={index} {...getPropsLesson(index)}>
                  {lesson && (
                    <>
                      <Box fontSize="sm">{lesson.groups.join(', ')}</Box>
                      <Box fontWeight="bold" color={boxSubjectColor}>
                        {lesson.subject}
                      </Box>
                      <Box fontSize="sm" color={boxClassroomColor}>
                        {lesson.classroom}
                      </Box>
                      <Box fontStyle="italic">{lesson.teachers.join(', ')}</Box>
                    </>
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
