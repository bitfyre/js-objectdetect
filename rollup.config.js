import eslint from 'rollup-plugin-eslint';
import path from 'path';

const env = process.env.NODE_ENV;

let buildDir;
let buildFormat;
let minify = env === 'production';

if (env === 'production' || env === 'development') {
  buildDir = 'dist';
  buildFormat = 'iife';
}

if (env === 'es' || env === 'cjs') {
  buildFormat = env;

  if (env === 'cjs') {
    buildDir = 'lib';
  } else {
    buildDir = 'module';
  }
}

const sources = [
  {
    input: 'main',
    name: 'ObjectDetector'
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
      file: `${buildDir}/${i.input}.js`,
      format: buildFormat,
      name: i.name
    }
  };
});

export default config;
