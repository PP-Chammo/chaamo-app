import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfigFile from '@/tailwind.config.js';

type TailwindColors = Record<string, string | Record<string, string>>;

export const getColor = (kebabCaseColorName: string): string => {
  const [color, contrast] = kebabCaseColorName.split('-');
  const { theme } = resolveConfig(tailwindConfigFile) as unknown as {
    theme: { colors: TailwindColors };
  };

  const colors = theme.colors;

  if (colors && Object.hasOwn(colors, color)) {
    const colorValue = colors[color];
    if (typeof colorValue === 'object' && contrast) {
      return (
        colorValue[contrast] ??
        (colors.red && typeof colors.red === 'object' && colors.red['700']) ??
        '#e11d48'
      );
    } else if (typeof colorValue === 'string') {
      return colorValue;
    }
  }
  return (
    (colors.red && typeof colors.red === 'object' && colors.red['700']) ||
    '#e11d48'
  );
};
