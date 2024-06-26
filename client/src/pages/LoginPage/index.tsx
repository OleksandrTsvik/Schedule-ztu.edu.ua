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

import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Container textAlign="center" mt={[null, null, 5, 8]} mb={5}>
      <Heading fontSize="4xl" mb={4}>
        Sign in to your account
      </Heading>
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow="dark-lg"
        rounded="lg"
        p={8}
      >
        <LoginForm />
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          align="start"
          justify="space-between"
          mt={8}
        >
          <Text>Don&#39;t have an account?</Text>
          <Link as={ReactRouterLink} to="/register" color="blue.400">
            Go to registration
          </Link>
        </Stack>
      </Box>
    </Container>
  );
}
