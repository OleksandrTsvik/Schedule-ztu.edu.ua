import {
  Button,
  ButtonProps,
  Tooltip,
  TooltipProps,
  useColorModeValue,
} from '@chakra-ui/react';

import { LIGHT_BG_HOVER_LINK, DARK_BG_HOVER_LINK } from './colors';

interface Props extends ButtonProps {
  lightBgHover?: string;
  darkBgHover?: string;
  label?: string;
  tooltipProps?: TooltipProps;
}

export default function NavbarButton({
  lightBgHover = LIGHT_BG_HOVER_LINK,
  darkBgHover = DARK_BG_HOVER_LINK,
  label,
  tooltipProps,
  ...props
}: Props) {
  const bgHover = useColorModeValue(lightBgHover, darkBgHover);

  return (
    <Tooltip label={label} {...tooltipProps}>
      <Button variant="ghost" _hover={{ bg: bgHover }} {...props} />
    </Tooltip>
  );
}
