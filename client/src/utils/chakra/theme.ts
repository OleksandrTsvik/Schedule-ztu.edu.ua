import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

let initialColorMode: 'light' | 'dark' | 'system' = 'system';
const chakraUiColorMode = localStorage.getItem('chakra-ui-color-mode');

if (
  chakraUiColorMode === 'light' ||
  chakraUiColorMode === 'dark' ||
  chakraUiColorMode === 'system'
) {
  initialColorMode = chakraUiColorMode;
}

const config: ThemeConfig = {
  initialColorMode,
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export default theme;
