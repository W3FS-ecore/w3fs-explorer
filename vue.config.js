var webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = {
  publicPath: "/",
  productionSourceMap: false,
  configureWebpack: () => {
    if (process.env.NODE_ENV == "production") {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
            threshold: 10240,
          }),
        ],
      };
    }
  },
  chainWebpack: (config) => {
    config
      .plugin("ignore")
      .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
  },
  devServer: {
    proxy: {
      "/v2": {
        target: "https://api.coincap.io",
        secure: true,
        changeOrigin: true,
        // pathRewrite: { "^/api": "" },
      },
      "/etherchain": {
        target: "https://www.etherchain.org",
        secure: true,
        changeOrigin: true,
        pathRewrite: { "^/etherchain": "" },
      },
      "/api": {
        target: "http://192.168.50.135:8080",
        secure: true,
        changeOrigin: true,
        // pathRewrite: { "^/api": "" },
      },
      // "/opt": {
      //   target: "http://192.168.50.135:8080",
      //   secure: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     // '^/api': ''
      //   },
      // },
    },
  },
};
