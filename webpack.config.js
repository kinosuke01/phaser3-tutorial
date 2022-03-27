const path = require('path')

module.exports = {
  mode: 'development',

  entry: {
    index: path.join(__dirname, '/src/index.ts'),
  },

  output: {
    path: path.join(__dirname, './'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
};
