import { ApiError } from '../../services/api';

interface Props {
  error: ApiError;
}

export default function ErrorMessage({ error }: Props) {
  if (typeof error.data.message === 'string') {
    return <>{error.data.message}</>;
  }

  return (
    <>
      {error.data.message.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </>
  );
}
