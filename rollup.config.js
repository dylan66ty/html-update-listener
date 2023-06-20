import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import fs from 'fs'

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url))
)

const banner =
  '/*!\n' +
  ` * ${pkg.name} v${pkg.version}\n` +
  ` * (c) ${new Date().getFullYear()} ${pkg.author}\n` +
  ` * Released under the ${pkg.license} License.\n` +
  ' */';

export default defineConfig({
  input: './src/index.ts',
  output: [
    { file: pkg.main, format: 'cjs', banner},
    { file: pkg.es, format: 'es', banner },
    { file: pkg.umd, format: 'umd', banner, name: pkg.name }
  ],
  plugins: [
    typescript(),
    babel({
      babelHelpers: 'bundled',
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false, loose: true }]],
      exclude: 'node_modules/**'
    })
  ]
})
