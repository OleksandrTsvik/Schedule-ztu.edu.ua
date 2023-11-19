import {
  Box,
  Container,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <Container textAlign="center" mt={[null, null, 5, 8]} mb={5}>
      <Heading fontSize="4xl" mb={4}>
        Sign up
      </Heading>
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow="dark-lg"
        rounded="lg"
        p={8}
      >
        <RegisterForm />
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          align="start"
          justify="space-between"
          mt={8}
        >
          <Text>Already a user?</Text>
          <Link as={ReactRouterLink} to="/login" color="blue.400">
            Login
          </Link>
        </Stack>
      </Box>
    </Container>
  );
}
