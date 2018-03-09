import copy from 'rollup-plugin-copy';

const plugins = [
  copy({
    'public/index.html': 'dist/index.html'
  })
];

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/build.js',
    name: 'build',
    format: 'cjs'
  },
  plugins,
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
};