import {
  Box,
  Flex,
  useColorModeValue,
  Container,
  Stack,
  Icon,
} from '@chakra-ui/react';
import { FaSignInAlt, FaSignOutAlt, FaWrench } from 'react-icons/fa';

import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';
import Logo from './Logo';
import ColorModeButton from './ColorModeButton';
import NavbarLink from './NavbarLink';
import NavbarButton from './NavbarButton';
import { LIGHT_BG_NAVBAR, DARK_BG_NAVBAR, COLOR_NAVBAR } from './colors';

export default function Navbar() {
  const { user } = useAuth();
  const { logout } = useLogout();

  return (
    <Box
      bg={useColorModeValue(LIGHT_BG_NAVBAR, DARK_BG_NAVBAR)}
      color={COLOR_NAVBAR}
    >
      <Container maxW="container.xl">
        <Flex h={14} alignItems="center" justifyContent="space-between">
          <Logo />

          <Stack direction="row" spacing={2}>
            <ColorModeButton />
            {user ? (
              <>
                <NavbarLink url="/settings" label="Settings">
                  <Icon as={FaWrench} color={COLOR_NAVBAR} />
                </NavbarLink>
                <NavbarButton label="Sign out" onClick={logout}>
                  <Icon as={FaSignOutAlt} color={COLOR_NAVBAR} />
                </NavbarButton>
              </>
            ) : (
              <NavbarLink url="/login" label="Sign in">
                <Icon as={FaSignInAlt} color={COLOR_NAVBAR} />
              </NavbarLink>
            )}
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}
