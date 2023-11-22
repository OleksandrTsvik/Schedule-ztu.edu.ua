import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

import { SubjectDisplayed } from '../../models/schedule.interface';

interface Props {
  lesson: SubjectDisplayed;
  wrapperProps?: BoxProps;
}

export default function LessonItem({ lesson, wrapperProps }: Props) {
  const boxClassroomColor = useColorModeValue('blue.500', 'blue.400');
  const boxSubjectColor = useColorModeValue('blue.900', 'orange.500');

  return (
    <Box {...wrapperProps}>
      <Box fontSize="sm">{lesson.groups.join(', ')}</Box>
      <Box fontWeight="bold" color={boxSubjectColor}>
        {lesson.subject}
      </Box>
      <Box fontSize="sm" color={boxClassroomColor}>
        {lesson.classroom}
      </Box>
      <Box fontStyle="italic">{lesson.teachers.join(', ')}</Box>
    </Box>
  );
}
