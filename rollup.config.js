import eslint from 'rollup-plugin-eslint';

export default [
  {
    input: 'main.js',
    output: {
      file: 'build/bundle.js',
      format: 'iife',
      name: 'ObjectDetector'
    },
    plugins: [eslint()],
    watch: {
      include: ['main.js', 'src/**/*.js']
    }
  },
  {
    input: 'src/classifiers/eye.js',
    output: {
      file: 'build/classifiers/eye.js',
      format: 'iife',
      name: 'eye'
    }
  },
  {
    input: 'src/classifiers/frontal-cat-face.js',
    output: {
      file: 'build/classifiers/frontal-cat-face.js',
      format: 'iife',
      name: 'frontalCatFace'
    }
  },
  {
    input: 'src/classifiers/frontal-face-alt.js',
    output: {
      file: 'build/classifiers/frontal-face-alt.js',
      format: 'iife',
      name: 'frontalFaceAlt'
    }
  },
  {
    input: 'src/classifiers/frontal-face.js',
    output: {
      file: 'build/classifiers/frontal-face.js',
      format: 'iife',
      name: 'frontalFace'
    }
  },
  {
    input: 'src/classifiers/fullbody.js',
    output: {
      file: 'build/classifiers/fullbody.js',
      format: 'iife',
      name: 'fullbody'
    }
  },
  {
    input: 'src/classifiers/hand-fist.js',
    output: {
      file: 'build/classifiers/hand-fist.js',
      format: 'iife',
      name: 'handFist'
    }
  },
  {
    input: 'src/classifiers/hand-open.js',
    output: {
      file: 'build/classifiers/hand-open.js',
      format: 'iife',
      name: 'handOpen'
    }
  },
  {
    input: 'src/classifiers/mouth.js',
    output: {
      file: 'build/classifiers/mouth.js',
      format: 'iife',
      name: 'mouth'
    }
  },
  {
    input: 'src/classifiers/nose.js',
    output: {
      file: 'build/classifiers/nose.js',
      format: 'iife',
      name: 'nose'
    }
  },
  {
    input: 'src/classifiers/profile-face.js',
    output: {
      file: 'build/classifiers/profile-face.js',
      format: 'iife',
      name: 'profileFace'
    }
  },
  {
    input: 'src/classifiers/smile.js',
    output: {
      file: 'build/classifiers/smile.js',
      format: 'iife',
      name: 'smile'
    }
  },
  {
    input: 'src/classifiers/upper-body.js',
    output: {
      file: 'build/classifiers/upper-body.js',
      format: 'iife',
      name: 'upperBody'
    }
  }
];
