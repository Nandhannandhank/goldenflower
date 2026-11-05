/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1E1F22',
        side: '#25262B',
        line: '#393B40',
        fg: '#DFE1E5',
        blue: '#4B9CD3',
        green: '#6AAB73',
      },
    },
  },
  plugins: [],
}
