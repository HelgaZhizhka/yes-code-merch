import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', 'src/styles/index.css', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mukta', 'system-ui', 'sans-serif'],
      },
      colors: {
        success: 'var(--success)',
        'success-foreground': 'var(--success-foreground)',

        primaryLight: 'var(--primary-light)',
        'primary-light-foreground': 'var(--primary-light-foreground)',
      },
    },
  },
  plugins: [animate],
};
export default config;
