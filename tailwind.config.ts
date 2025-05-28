import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  content: ['./index.html', 'src/styles/index.css', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [animate],
}
export default config
