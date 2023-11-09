import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  useColorMode,
  Container,
  Stack,
  Icon,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg={useColorModeValue('blue.600', 'gray.900')} color="white">
      <Container maxW={'container.xl'}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Box>Schedule</Box>

          <Stack direction={'row'} spacing={2}>
            <Button variant="ghost">
              <SettingsIcon />
            </Button>
            <Button onClick={toggleColorMode} variant="ghost">
              {colorMode === 'light' ? (
                <Icon as={FaMoon} />
              ) : (
                <Icon as={FaSun} />
              )}
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}
