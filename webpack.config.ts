import Webpack from "webpack";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";

const config: Webpack.Configuration = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    libraryExport: "default",
    path: path.resolve(__dirname, `./dist/`),
    filename: "polyfill.js",
    pathinfo: false,
  },

  experiments: {
    topLevelAwait: true,
    outputModule: true,
  },

  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },

      {
        test: /\.[tj]sx?$/,
        loader: "esbuild-loader",
        options: {
          target: "es6",
        },
      },
    ],
  },

  optimization: {
    minimize: true,
    innerGraph: true,
    usedExports: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,

        minify: TerserPlugin.swcMinify,
        terserOptions: {
          compress: {
            arguments: true,
            toplevel: true,
            ecma: 5,
            comparisons: false,
            inline: 2,
          },

          mangle: {
            safari10: true,
          },
        },
      }),
    ],
  },
};

export default config;
