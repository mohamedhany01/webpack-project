/* 
  ---------
  | NOTES |
  ---------
  1. Don't use [contenthash] in development, HMR with Stylesheets will't work.
  2. By default devServer's liveReload option is enable, so HMR will not work, make sure to set "false".
  3. To work with react-router, to need to enable ENABLE_REACT_ROUTER = true, and publicPath="/" in output{}.
*/
const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin"),
  Dotenv = require("dotenv-webpack");

/* 
  General Configurations
*/
const PORT_NUMBER = 5002;
const ENABLE_HMR = true;
const ENABLE_REACT_ROUTER = true;

module.exports = {
  entry: "./src/app/index.js",
  output: {
    filename: "script/main.min.js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
  },
  mode: "development",
  devtool: false,
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [require.resolve("react-refresh/babel")],
            },
          },
        ],
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
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
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        exclude: [path.resolve(__dirname, "./src/fonts")],
        generator: {
          filename: "images/[name][ext]",
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
      filename: "style/[name].min.css",
    }),
    new ReactRefreshWebpackPlugin(),
    // new Dotenv({
    //   path: ".env",
    // }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "../src"),
    },
    open: {
      target: `http://localhost:${PORT_NUMBER}`,
      app: {
        name: "google-chrome",
        arguments: ["--incognito"],
      },
    },
    liveReload: ENABLE_HMR ? false : true,
    hot: ENABLE_HMR ? ENABLE_HMR : false,
    compress: true,
    port: PORT_NUMBER,
    historyApiFallback: ENABLE_REACT_ROUTER ? ENABLE_REACT_ROUTER : false,
  },
};
