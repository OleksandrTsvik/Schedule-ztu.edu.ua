import { Skeleton, SkeletonProps, Stack, StackProps } from '@chakra-ui/react';

interface Props extends SkeletonProps {
  countSkeletons?: number;
  stackProps?: StackProps;
}

export default function StackSkeleton({
  countSkeletons = 4,
  height = '20px',
  stackProps,
  ...props
}: Props) {
  return (
    <Stack {...stackProps}>
      {Array(countSkeletons)
        .fill(null)
        .map((_, index) => (
          <Skeleton key={index} height={height} {...props} />
        ))}
    </Stack>
  );
}
