/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C2321',
        slate: {
          850: '#1E2A2E',
        },
        brass: '#B08D57',
        teal: {
          deep: '#0F3D3E',
          mid: '#155E63',
        },
        parchment: '#F6F3EC',
        alert: '#B3542D',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
