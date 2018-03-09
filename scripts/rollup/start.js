const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const chalk = require('chalk');
const babel = require('rollup-plugin-babel');
const livereload = require('rollup-plugin-livereload');
const serve = require('rollup-plugin-serve');
const uglify = require('rollup-plugin-uglify');
const string = require('rollup-plugin-string');
const { asyncRimRaf } = require('./utils');

// process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

const plugins = [
  babel({
    exclude: ['node_modules/**', '**/*.html'],
    plugins: ['external-helpers']
  }),
  commonjs({
    include: 'node_modules/**',
    exclude: ['node_modules/@webcomponents/webcomponentsjs/**'],
  }),
  uglify(),
  resolve({
    jsnext: true,
    browser: true,
    main: true
  }),
  string({
    // Required to be specified
    include: '**/*.html',

    // Undefined by default
    exclude: ['**/index.html']
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
  input: 'src/main.js',
  plugins,
  // external: ['jquery']
};
const outputOptions = {
  file: 'build/build.js',
  name: 'build',
  format: 'umd',
  globals: {
    jquery: '$',
    backbone: 'Backbone',
    underscore: '_'
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
  await asyncRimRaf('build');
  //create a bundle
  const bundle = await rollup.rollup(inputOptions);

  // // generate code and a sourcemap
  // const { code, map } = await bundle.generate(outputOptions);

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