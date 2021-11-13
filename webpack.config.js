const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs2',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: 'yt-emoji-picker-[local]',
                exportLocalsConvention: 'camelCase',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: { javascriptEnabled: true },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  externalsPresets: { node: true },
  externals: [nodeExternals({
    allowlist: [],
  })],
  optimization: {
    minimize: true,
    minimizer: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: 'src/emoji-toolkit.d.ts', to: 'emoji-toolkit.d.ts' },
        ],
      }),
      // 一般来讲 cjs 或者 esm 的组件库输出，都会被第三方通过 npm install 来使用，所以这两种代码输出的可以是不压缩的代码，以保证一定的可读性；
      // 但是如果第三方使用也通过 webpack 作为打包工具，那么这里就会遇到问题 TypeError: __webpack_modules__[moduleId] is not a function。
      // 这个问题的原因是，一个使用 webpack 作为打包工具的第三方使用者，使用了我们通过 webpack 5.x 且没有被 terser 压缩过的 package 引起的 #11827，
      // 解决办法就是输出压缩后的代码（相应的，代码基本不可读）
      new TerserJSPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
};
