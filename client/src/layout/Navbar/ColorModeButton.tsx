import {
  Button,
  useColorMode,
  Icon,
  ButtonProps,
  IconProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

import { LIGHT_BG_HOVER_LINK, DARK_BG_HOVER_LINK } from './colors';

interface Props extends ButtonProps {
  lightBgHover?: string;
  darkBgHover?: string;
  iconProps?: IconProps;
}

export default function ColorModeButton({
  lightBgHover = LIGHT_BG_HOVER_LINK,
  darkBgHover = DARK_BG_HOVER_LINK,
  iconProps,
  ...props
}: Props) {
  const { colorMode, toggleColorMode } = useColorMode();

  const bgHover = useColorModeValue(lightBgHover, darkBgHover);

  return (
    <Button
      variant="ghost"
      onClick={toggleColorMode}
      {...props}
      _hover={{ bg: bgHover }}
    >
      {colorMode === 'light' ? (
        <Icon as={FaMoon} color="white" {...iconProps} />
      ) : (
        <Icon as={FaSun} color="white" {...iconProps} />
      )}
    </Button>
  );
}
