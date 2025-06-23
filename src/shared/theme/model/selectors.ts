import { useThemeStore } from './store';

export const useThemeValue = () => useThemeStore((state) => state.theme);
export const useSetTheme = () => useThemeStore((state) => state.setTheme);
