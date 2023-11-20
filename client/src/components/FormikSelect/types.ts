import type { RefAttributes } from 'react';
import type { GroupBase, Props, SelectInstance } from 'react-select';

export type OptionType = {
  value: string;
  label: string;
};

export type OptionsType = Array<OptionType>;

export type GroupType = { label?: string; options: OptionsType };

export type ChakraReactSelectProps<
  Option = OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Props<Option, IsMulti, Group> &
  RefAttributes<SelectInstance<Option, IsMulti, Group>>;
