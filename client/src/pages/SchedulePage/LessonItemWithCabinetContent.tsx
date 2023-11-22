import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';

import { SubjectDisplayed } from '../../models/schedule.interface';
import LessonItem from './LessonItem';

interface Props {
  lesson: SubjectDisplayed;
}

export default function LessonItemWithCabinetContent({ lesson }: Props) {
  if (!lesson.cabinetContent) {
    return <LessonItem lesson={lesson} />;
  }

  return (
    <Popover placement="right-start" closeOnBlur={false}>
      <PopoverTrigger>
        <Box>
          <LessonItem lesson={lesson} wrapperProps={{ cursor: 'pointer' }} />
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader textAlign="start">Cabinet content</PopoverHeader>
        <PopoverBody
          textAlign="start"
          dangerouslySetInnerHTML={{ __html: lesson.cabinetContent }}
        />
      </PopoverContent>
    </Popover>
  );
}
