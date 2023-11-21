import { useGetSubjectsQuery } from '../../services/schedule.api';
import { ErrorResult, StackSkeleton } from '../../components';
import SubjectsTable from './SubjectsTable';

export default function ShowedSubjectsPage() {
  const { data, isLoading, isError, error } = useGetSubjectsQuery();

  return (
    <>
      {isLoading && <StackSkeleton />}
      {isError && <ErrorResult error={error} />}
      {data && <SubjectsTable subjects={data} />}
    </>
  );
}
