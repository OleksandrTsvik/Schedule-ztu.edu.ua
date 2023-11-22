import { Tooltip, TooltipProps, Icon, IconProps } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

interface Props {
  label: React.ReactNode;
  tooltipProps?: TooltipProps;
  iconProps?: IconProps;
}

export default function InfoTooltip({ label, tooltipProps, iconProps }: Props) {
  return (
    <Tooltip label={label} {...tooltipProps}>
      <Icon
        as={InfoOutlineIcon}
        ml={2}
        bgColor="transparent"
        _hover={{ bgColor: 'transparent' }}
        {...iconProps}
      />
    </Tooltip>
  );
}
