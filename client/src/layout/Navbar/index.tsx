import { NavLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  useColorMode,
  Container,
  Stack,
  Icon,
  Link,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  const activeLinkBg = useColorModeValue('blue.500', 'gray.700');
  const buttonHoverBg = useColorModeValue('blackAlpha.300', 'whiteAlpha.200');

  return (
    <Box bg={useColorModeValue('blue.600', 'gray.900')} color="white">
      <Container maxW={'container.xl'}>
        <Flex h={14} alignItems="center" justifyContent="space-between">
          <Link
            as={NavLink}
            to="/"
            px={2}
            py={4}
            _activeLink={{
              backgroundColor: activeLinkBg,
            }}
          >
            Schedule
          </Link>

          <Stack direction={'row'} spacing={2}>
            <Button
              variant="ghost"
              as={NavLink}
              to="/settings"
              _activeLink={{ bg: activeLinkBg }}
              _hover={{ bg: buttonHoverBg }}
            >
              <SettingsIcon color="white" />
            </Button>
            <Button
              variant="ghost"
              _hover={{ bg: buttonHoverBg }}
              onClick={toggleColorMode}
            >
              {colorMode === 'light' ? (
                <Icon as={FaMoon} color="white" />
              ) : (
                <Icon as={FaSun} color="white" />
              )}
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}
