import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgPlugin from 'vite-plugin-svg';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(),
    commonjs(),
    svgPlugin(),],
  assetsInclude: ["**/*.SVG"],
  resolve: {
    alias: {
      'vite-svg-loader': 'vite-svg-loader/dist/plugin.js',
    },
  },
//   optimizeDeps: {
//     include: ['web3j']
// }
  // define: {
  //   'process.env': process.env
  // }
  //  resolve: {
  //   alias: [
  //     {
  //       find: 'web3',
  //       replacement: 'web3/dist/web3.min.js',
  //     },
  //   ],

  //   }
  // define: {
  //   'process.env': {}
  // }

})
