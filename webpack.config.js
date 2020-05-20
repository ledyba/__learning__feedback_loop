const path = require('path');

module.exports = {
  mode: 'development', // "production" | "development" | "none"
  entry: {
    'main': __dirname+'/src/main.ts',
  },
  output: {
    path: __dirname + '/dist/',
    filename: '[name].js',
    publicPath: '/dist/'
  },
  module: {
      rules: [{
      // 拡張子 .ts の場合
      test: /\.ts$/,
      // TypeScript をコンパイルする
      use: 'ts-loader'
      }]
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
