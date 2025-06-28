// ✅ Correct (for Tailwind 4+ with Vite)
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindcss(),
    autoprefixer()
  ],
}
