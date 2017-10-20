import eslint from 'rollup-plugin-eslint';

export default {
  input: 'main.js',
  output: {
    file: 'build/bundle.js',
    format: 'cjs'
  },
  plugins: [eslint()],
  watch: {
    include: ['main.js', 'src/**']
  }
};
