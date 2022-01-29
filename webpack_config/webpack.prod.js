const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  CssMinimizerPlugin = require("css-minimizer-webpack-plugin"),
  TerserPlugin = require("terser-webpack-plugin"),
  ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  entry: "./src/app/index.js",
  output: {
    filename: "script/main.[contenthash].min.js",
    path: path.resolve(__dirname, "../dist"),
    clean: true,
  },
  mode: "production",
  devtool: 'inline-source-map',
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
          {
            loader: "resolve-url-loader",
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        exclude: [path.resolve(__dirname, "./src/images")],
        generator: {
          filename: "fonts/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        exclude: [path.resolve(__dirname, "./src/fonts")],
        generator: {
          filename: "images/[name].[contenthash][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Hello React",
      favicon: "./src/favicon.png",
      template: "./src/template.html",
      filename: "index.html",
    }),

    new MiniCssExtractPlugin({
      filename: "style/[name].[contenthash].min.css",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new HtmlMinimizerPlugin(),
      new CssMinimizerPlugin(),
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          inlineStyles: {
                            onlyMatchedOnce: false,
                          },
                          removeDoctype: false,
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
};
