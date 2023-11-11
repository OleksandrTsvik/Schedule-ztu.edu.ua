import {
  Box,
  Container,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Footer() {
  const email = 'oleksandr.zwick@gmail.com';

  return (
    <Box bg={useColorModeValue('blue.600', 'gray.900')} color="white">
      <Container maxW="container.xl" py={5}>
        <Text textAlign="center">
          {/*© 2023 - {(new Date()).getFullYear()}. Copyright:&ensp;*/}© 2023.
          Copyright:&ensp;
          <Link
            href={`mailto:${email}`}
            color={useColorModeValue('gray.900', 'teal.500')}
          >
            {email}
          </Link>
        </Text>
      </Container>
    </Box>
  );
}
