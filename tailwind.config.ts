import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sakura': '#FFC0CB',
        'sakura-dark': '#FFB6C1',
        'sakura-light': '#FFE4E1',
        'mystic-black': '#0a0a0a',
        'mystic-dark': '#1a1a1a',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['"Noto Sans JP"', 'sans-serif'],
      },
      boxShadow: {
        'sakura': '0 4px 14px 0 rgba(255, 192, 203, 0.15)',
        'sakura-glow': '0 0 20px rgba(255, 192, 203, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config

