import { NavLink, NavLinkProps } from 'react-router-dom';
import { Link, LinkProps, useColorModeValue } from '@chakra-ui/react';

import { DARK_BG_ACTIVE_LINK, LIGHT_BG_ACTIVE_LINK } from './colors';

interface Props extends LinkProps {
  url?: string;
  text?: React.ReactNode;
  lightBgActive?: string;
  darkBgActive?: string;
  navLinkProps?: NavLinkProps;
}

export default function Logo({
  url = '/',
  text = 'Schedule',
  lightBgActive = LIGHT_BG_ACTIVE_LINK,
  darkBgActive = DARK_BG_ACTIVE_LINK,
  navLinkProps,
  ...props
}: Props) {
  const bgActive = useColorModeValue(lightBgActive, darkBgActive);

  return (
    <Link
      px={2}
      py={4}
      {...props}
      _activeLink={{
        backgroundColor: bgActive,
      }}
      as={NavLink}
      to={url}
    >
      {text}
    </Link>
  );
}
