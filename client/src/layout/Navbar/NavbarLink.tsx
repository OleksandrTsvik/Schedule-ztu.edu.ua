import { NavLink } from 'react-router-dom';
import {
  Button,
  ButtonProps,
  Tooltip,
  TooltipProps,
  useColorModeValue,
} from '@chakra-ui/react';

import {
  DARK_BG_ACTIVE_LINK,
  DARK_BG_HOVER_LINK,
  LIGHT_BG_ACTIVE_LINK,
  LIGHT_BG_HOVER_LINK,
} from './colors';

interface Props extends ButtonProps {
  url: string;
  lightBgActive?: string;
  darkBgActive?: string;
  lightBgHover?: string;
  darkBgHover?: string;
  label?: string;
  tooltipProps?: TooltipProps;
}

export default function NavbarLink({
  url,
  lightBgActive = LIGHT_BG_ACTIVE_LINK,
  darkBgActive = DARK_BG_ACTIVE_LINK,
  lightBgHover = LIGHT_BG_HOVER_LINK,
  darkBgHover = DARK_BG_HOVER_LINK,
  label,
  tooltipProps,
  ...props
}: Props) {
  const bgActive = useColorModeValue(lightBgActive, darkBgActive);
  const bgHover = useColorModeValue(lightBgHover, darkBgHover);

  return (
    <Tooltip label={label} {...tooltipProps}>
      <Button
        variant="ghost"
        _activeLink={{ bg: bgActive }}
        _hover={{ bg: bgHover }}
        {...props}
        as={NavLink}
        to={url}
      />
    </Tooltip>
  );
}
