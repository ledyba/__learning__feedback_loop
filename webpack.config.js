const path = require('path');

module.exports = {
  mode: 'development', // "production" | "development" | "none"
  entry: {
    'main': path.join(__dirname, 'src', 'main.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    modules: [
    "node_modules", // node_modules 内も対象とする
    ],
    extensions: [
    '.ts',
    '.js' // node_modulesのライブラリ読み込みに必要
    ]
  }
};
