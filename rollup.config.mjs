import { defineConfig } from 'rollup'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'

// import css from 'rollup-plugin-css-only'
// import del from 'rollup-plugin-delete'

import pkg from './package.json' with { type: 'json' }

export default defineConfig([
  {
    input: pkg.source,
    output: [
      {
        file: pkg.exports['.'].import,
        format: 'esm',
        sourcemap: true
      },
      {
        file: pkg.exports['.'].require,
        format: 'cjs',
        sourcemap: true
      }
    ],
    external: /node_modules/,
    plugins: [
      nodeResolve(),
      terser(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: true,
        declaration: true,
        declarationDir: 'dist'
      })
    ]
  },

  // Type desclarations
  {
    input: 'dist/index.d.ts',
    output: {
      file: pkg.exports['.'].types,
      format: 'esm'
    },
    plugins: [
      dts()
    ]
  }
])

// const banner = `/**
//  * Vue 3 Vue Axios Manager ${pkg.version}
//  * (c) ${new Date().getFullYear()}
//  * @license MIT
//  */`

// const output = [
//   {
//     file: 'dist/vue-axios-manager.js',
//     format: 'umd',
//     name: 'VueAxiosManager',
//     banner,
//     globals: {
//       vue: 'Vue'
//     },
//     sourcemap: true
//   },
//   {
//     file: 'dist/vue-axios-manager.min.js',
//     format: 'umd',
//     name: 'VueAxiosManager',
//     banner,
//     globals: {
//       vue: 'Vue'
//     },
//     plugins: [terser()],
//     sourcemap: true
//   },
//   {
//     file: 'dist/vue-axios-manager.mjs',
//     format: 'es',
//     banner,
//     sourcemap: true
//   },
//   {
//     file: 'dist/vue-axios-manager.cjs',
//     format: 'cjs',
//     banner,
//     sourcemap: true
//   }
// ]

// export default [
//   {
//     input: 'src/index.ts',
//     output: output,
//     external: [
//       ...Object.keys(pkg.dependencies || {}),
//       ...Object.keys(pkg.peerDependencies || {})
//     ]
//     // plugins: [
//     //   css({ output: 'vue-axios-manager.css' }),
//     //   typescript(),
//     //   del({ targets: 'dist/*', hook: 'buildStart' }), // Clean 'dist' folder before each build
//     // ],
//   },
//   {
//     input: 'src/index.ts',
//     output: [{ file: 'dist/vue-axios-manager.d.ts', format: 'es' }],
//     external: ['vue', /\.css$/],
//     plugins: [
//       typescript(),
//       dts({
//         rollupTypes: false,
//         pathsToAliases: true,
//         declarationOnly: true,
//         exclude: ['**/tests/**', '**/*.test.ts', 'src/devtools.ts']
//       })
//     ]
//   }
// ]
