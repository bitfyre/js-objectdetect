import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;

let buildDir;
let buildFormat;
let suffix = '';
const plugins = [];

if (env === 'es' || env === 'cjs') {
  buildFormat = env;

  plugins.push(
    babel({
      plugins: ['external-helpers']
    })
  );

  if (env === 'cjs') {
    buildDir = 'lib';
  } else {
    buildDir = 'module';
  }
}

if (env === 'production' || env === 'development') {
  buildDir = 'dist';
  buildFormat = 'iife';
  plugins.push(
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
    filesize()
  );
}

if (env === 'production') {
  suffix = '.min';
  plugins.push(uglify());
}

const sources = [
  {
    input: 'main',
    name: 'objectDetector'
  },
  {
    input: 'classifiers/eye',
    name: 'eye'
  },
  {
    input: 'classifiers/frontal-cat-face',
    name: 'frontalCatFace'
  },
  {
    input: 'classifiers/frontal-face-alt',
    name: 'frontalFaceAlt'
  },
  {
    input: 'classifiers/frontal-face',
    name: 'frontalFace'
  },
  {
    input: 'classifiers/fullbody',
    name: 'fullbody'
  },
  {
    input: 'classifiers/hand-fist',
    name: 'handFist'
  },
  {
    input: 'classifiers/hand-open',
    name: 'handOpen'
  },
  {
    input: 'classifiers/mouth',
    name: 'mouth'
  },
  {
    input: 'classifiers/nose',
    name: 'nose'
  },
  {
    input: 'classifiers/profile-face',
    name: 'profileFace'
  },
  {
    input: 'classifiers/smile',
    name: 'smile'
  },
  {
    input: 'classifiers/upper-body',
    name: 'upperBody'
  }
];

const config = sources.map(i => {
  return {
    input: `src/${i.input}.js`,
    output: {
      file: `${buildDir}/${i.input}${suffix}.js`,
      format: buildFormat,
      name: i.name
    },
    plugins
  };
});

export default config;
