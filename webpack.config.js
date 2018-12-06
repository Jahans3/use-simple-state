const path = require('path');

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  }
};