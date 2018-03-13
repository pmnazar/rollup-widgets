const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const chalk = require('chalk');
const babel = require('rollup-plugin-babel');
const html = require('rollup-plugin-fill-html');
const livereload = require('rollup-plugin-livereload');
const serve = require('rollup-plugin-serve');
const uglify = require('rollup-plugin-uglify');
const alias = require('rollup-plugin-alias');
const replace = require('rollup-plugin-replace');
const legacy = require('rollup-plugin-legacy');
const async = require('rollup-plugin-async');
const ad = require('rollup-plugin-async-define');
const string = require('rollup-plugin-string');
const { asyncRimRaf } = require('./utils');

process.on('unhandledRejection', err => {
  throw err;
});

const plugins = [
  babel({
    exclude: ['node_modules/**', '**/*.html'],
    plugins: ['external-helpers']
  }),
  commonjs({
    include:['node_modules/**', 'src/lite-widget/app/core/libs/**'],
    exclude: ['node_modules/@webcomponents/webcomponentsjs/**']
  }),
  resolve({
    jsnext: true,
    browser: true,
    main: true,
    module: true,
    extensions: ['.js', '.jsx']
  }),
  string({
    include: '**/*.html',
    exclude: ['**/index.html']
  }),
  html({
    template: 'src/index.html',
    filename: 'index.html'
  }),
  serve({
    contentBase: ['build'],
    host: 'localhost',
    port: 3000,
  }),
  livereload({
    watch: 'build',
  }),
];

const inputOptions = {
  // input: 'src/main.js',
  input: 'src/lite-widget/router-smart-desktop.js',
  plugins,
  external: ['jquery']
};
const outputOptions = {
  file: 'build/build.js',
  name: 'build',
  format: 'umd',
  globals: {
    'jquery': '$',
  },
  sourcemap: true
};

const watchOptions = Object.assign(inputOptions, {
  output: [outputOptions],
  watch: {
    include: ['src/**'],
    exclude: ['node_modules/**']
  }
});

async function build(options) {
  const opt = options || {};
  const isWatch = opt.watch || false;

  const bundle = await rollup.rollup(inputOptions);

  await bundle.write(outputOptions);

  if (isWatch) watch();
}

async function watch() {
  const watcher = rollup.watch(watchOptions);
  let d;

  watcher.on('event', async event => {
    switch (event.code) {
      case 'START':
        d = new Date();
        console.log(chalk.gray.bold(event.code));
        break;
      case 'BUNDLE_START':
        break;
      case 'BUNDLE_END':
        console.log(chalk.green.bold(`${event.input} ---> ${event.output} ${new Date() - d}ms`));
        break;
      case 'END':
        build();
        console.log(chalk.gray.bold(event.code));
        break;
      default:
        return;
    }
  });
}

build({ watch: true });