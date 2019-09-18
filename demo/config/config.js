import webpackPlugin from './plugin.config';

export default {
  treeShaking: true,
  chainWebpack: webpackPlugin,
  disableCSSModules: true,
  cssLoaderOptions: {
    modules: false,
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: false,
      dynamicImport: false,
      title: 'demo',
      dll: false,

      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
}
