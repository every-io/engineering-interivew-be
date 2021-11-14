const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@config': path.resolve(__dirname, 'src/config/'),
      '@controller': path.resolve(__dirname, 'src/controller/'),
      '@entity': path.resolve(__dirname, 'src/entity/'),
      '@services': path.resolve(__dirname, 'src/services/'),
      '@routes': path.resolve(__dirname, 'src/routes/'),
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
