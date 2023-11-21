import { useMemo } from 'react';
import { Flex, Heading, Tag } from '@chakra-ui/react';

import mutationWithToast from '../../utils/helpers/mutationWithToast';
import { ScheduleSubject } from '../../models/schedule.interface';
import { useToggleShowSubjectsByNameMutation } from '../../services/schedule.api';

interface ShowedSubject {
  subject: string;
  show: boolean;
}

interface Props {
  subjects: ScheduleSubject[];
}

export default function ShowedSubjects({ subjects }: Props) {
  const [toggleShowSubjectsByName] = useToggleShowSubjectsByNameMutation();

  const showedSubjects: ShowedSubject[] = useMemo(
    () =>
      subjects.reduce((previousSubjects, currentSubject) => {
        const isExistSubject = previousSubjects.some(
          (subject) => currentSubject.subject === subject.subject,
        );

        if (isExistSubject) {
          return previousSubjects;
        }

        const isShowedSubject = subjects.some(
          (subject) =>
            subject.subject === currentSubject.subject && subject.show,
        );

        return [
          ...previousSubjects,
          {
            subject: currentSubject.subject,
            show: isShowedSubject,
          },
        ];
      }, [] as ShowedSubject[]),
    [subjects],
  );

  async function handleToggleShowSubjectsByName(subject: ShowedSubject) {
    await mutationWithToast({
      mutation: toggleShowSubjectsByName,
      argument: {
        subject: subject.subject,
        show: !subject.show,
      },
    });
  }

  return (
    <>
      <Heading as="h4" size="md" mb={3}>
        Showed subjects
      </Heading>
      <Flex wrap="wrap" gap={2} mb={4}>
        {showedSubjects.map((subject) => (
          <Tag
            key={subject.subject}
            size="lg"
            variant="solid"
            borderRadius="full"
            cursor="pointer"
            colorScheme={subject.show ? 'green' : 'yellow'}
            onClick={() => handleToggleShowSubjectsByName(subject)}
          >
            {subject.subject}
          </Tag>
        ))}
      </Flex>
    </>
  );
}
