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

const sourceConfigs = [
  {
    input: 'main.js',
    output: {
      file: path.join(buildDir, 'bundle.js'),
      format: buildFormat,
      name: 'ObjectDetector'
    },
    //plugins: [eslint()],
    watch: {
      include: ['main.js', 'src/**/*.js']
    }
  },
  {
    input: 'src/classifiers/eye.js',
    output: {
      file: path.join(buildDir, 'classifiers/eye.js'),
      format: buildFormat,
      name: 'eye'
    }
  },
  {
    input: 'src/classifiers/frontal-cat-face.js',
    output: {
      file: path.join(buildDir, 'classifiers/frontal-cat-face.js'),
      format: buildFormat,
      name: 'frontalCatFace'
    }
  },
  {
    input: 'src/classifiers/frontal-face-alt.js',
    output: {
      file: path.join(buildDir, 'classifiers/frontal-face-alt.js'),
      format: buildFormat,
      name: 'frontalFaceAlt'
    }
  },
  {
    input: 'src/classifiers/frontal-face.js',
    output: {
      file: path.join(buildDir, 'classifiers/frontal-face.js'),
      format: buildFormat,
      name: 'frontalFace'
    }
  },
  {
    input: 'src/classifiers/fullbody.js',
    output: {
      file: path.join(buildDir, 'classifiers/fullbody.js'),
      format: buildFormat,
      name: 'fullbody'
    }
  },
  {
    input: 'src/classifiers/hand-fist.js',
    output: {
      file: path.join(buildDir, 'classifiers/hand-fist.js'),
      format: buildFormat,
      name: 'handFist'
    }
  },
  {
    input: 'src/classifiers/hand-open.js',
    output: {
      file: path.join(buildDir, 'classifiers/hand-open.js'),
      format: buildFormat,
      name: 'handOpen'
    }
  },
  {
    input: 'src/classifiers/mouth.js',
    output: {
      file: path.join(buildDir, 'classifiers/mouth.js'),
      format: buildFormat,
      name: 'mouth'
    }
  },
  {
    input: 'src/classifiers/nose.js',
    output: {
      file: path.join(buildDir, 'classifiers/nose.js'),
      format: buildFormat,
      name: 'nose'
    }
  },
  {
    input: 'src/classifiers/profile-face.js',
    output: {
      file: path.join(buildDir, 'classifiers/profile-face.js'),
      format: buildFormat,
      name: 'profileFace'
    }
  },
  {
    input: 'src/classifiers/smile.js',
    output: {
      file: path.join(buildDir, 'classifiers/smile.js'),
      format: buildFormat,
      name: 'smile'
    }
  },
  {
    input: 'src/classifiers/upper-body.js',
    output: {
      file: path.join(buildDir, 'classifiers/upper-body.js'),
      format: buildFormat,
      name: 'upperBody'
    }
  }
];

export default sourceConfigs;
