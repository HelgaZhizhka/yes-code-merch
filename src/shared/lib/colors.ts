export const COLOR_HEX: Record<string, string> = {
  white: '#fafafa',
  black: '#1a1a1a',
  orange: '#f2760f',
  blue: '#3e17ff',
  green: '#008a40',
  purple: '#b62dd3',
  red: '#dc2626',
  gray: '#9ca3af',
  beige: '#d2bfa9',
  navy: '#1e3a5f',
  brown: '#8b5a2b',
  yellow: '#facc15',
  lightblue: '#7cc7ff',
};

const LIGHT_COLORS = new Set(['white', 'beige', 'yellow', 'lightblue']);
export const isLightColor = (color: string): boolean => LIGHT_COLORS.has(color);
