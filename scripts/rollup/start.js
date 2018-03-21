const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const chalk = require('chalk');
const babel = require('rollup-plugin-babel');
const livereload = require('rollup-plugin-livereload');
const serve = require('rollup-plugin-serve');
const uglify = require('rollup-plugin-uglify');
const string = require('rollup-plugin-string');

process.on('unhandledRejection', err => {
  throw err;
});

const plugins = [
  // postcss({
  //   plugins: []
  // }),
  babel({
    exclude: ['node_modules/**', '**/*.html'],
    plugins: ['external-helpers']
  }),
  commonjs({
    include: ['node_modules/**', 'src/lite-widget/app/core/libs/**'],
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
    include: ['**/*.html', '**/*.tpl'],
    // exclude: ['**/index.html']
  }),
  // html({
  //   template: 'src/lw/smart-desktop/index.html',
  //   filename: 'index.html',
  //
  // }),
  // serve({
  //   contentBase: ['build'],
  //   host: 'localhost',
  //   port: 3000,
  // }),
  // livereload({
  //   watch: 'build',
  // }),
];

const inputOptions = {
  input: 'src/lw/router-smart-desktop.js',
  // input: 'src/lite-widget/router-smart-desktop.js',
  plugins,
  external: ['jquery']
};
const outputOptions = {
  file: '../1w-main/WebUI/WebContent/external/build/1worldonline/widget/build.js',
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