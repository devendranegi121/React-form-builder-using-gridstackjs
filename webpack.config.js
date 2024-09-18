const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  performance: {
    maxEntrypointSize: 5120000,
    maxAssetSize: 5120000
  },
  entry: ["@babel/polyfill", path.join(__dirname, "src", "index.js")],

  output: {
    path: path.join(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "",
  },

  resolve: {
    alias: {
    //  'jquery-ui': 'jquery-ui-dist/jquery-ui.js',
      'jquery-ui': 'jquery-ui/ui'

    }
  },
  externals: {
    'jquery-ui': 'jquery-ui-dist/jquery-ui'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.(woff|ttf|eot|otf|svg|jpg|png|gif)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/fonts/'
            },
          }
        ]
      },
      {
        test: /\.(s[ac]ss|otf)$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),

    new CopyPlugin({
      patterns: [
        { from: "assets/images/**/*", to: "" },
        { from: "exm-files/exm-sdk-client-2.1.1.min.js", to: "exm-files/" },
        { from: "exm-files/timestamp.txt", to: "exm-files/" },
      ],
    }),
  ],
};
