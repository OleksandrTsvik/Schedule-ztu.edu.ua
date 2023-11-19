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
  Tooltip,
} from '@chakra-ui/react';
import {
  FaMoon,
  FaSignInAlt,
  FaSignOutAlt,
  FaSun,
  FaWrench,
} from 'react-icons/fa';

import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';

export default function Navbar() {
  const { user } = useAuth();
  const { logout } = useLogout();

  const { colorMode, toggleColorMode } = useColorMode();

  const activeLinkBg = useColorModeValue('blue.500', 'gray.700');
  const buttonHoverBg = useColorModeValue('blackAlpha.300', 'whiteAlpha.200');

  return (
    <Box bg={useColorModeValue('blue.600', 'gray.900')} color="white">
      <Container maxW="container.xl">
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

          <Stack direction="row" spacing={2}>
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
            {user ? (
              <>
                <Tooltip label="Settings">
                  <Button
                    variant="ghost"
                    as={NavLink}
                    to="/settings"
                    _activeLink={{ bg: activeLinkBg }}
                    _hover={{ bg: buttonHoverBg }}
                  >
                    <Icon as={FaWrench} color="white" />
                  </Button>
                </Tooltip>
                <Tooltip label="Sign out">
                  <Button
                    variant="ghost"
                    _hover={{ bg: buttonHoverBg }}
                    onClick={logout}
                  >
                    <Icon as={FaSignOutAlt} color="white" />
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Tooltip label="Sign in">
                <Button
                  variant="ghost"
                  as={NavLink}
                  to="/login"
                  _activeLink={{ bg: activeLinkBg }}
                  _hover={{ bg: buttonHoverBg }}
                >
                  <Icon as={FaSignInAlt} color="white" />
                </Button>
              </Tooltip>
            )}
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}
