const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProductionMode = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    main: path.resolve(__dirname, '..', './src/index.js'),
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..', './dist'),
    // clean: true,
    // filename: isProductionMode ? '[name].[contenthash].bundle.js' : '[name].js',
    // chunkFilename: '[name].[contenthash].bundle.js',
    // path: path.resolve(__dirname, '..', './dist'),
    // assetModuleFilename: isProductionMode
    //   ? 'asset/[name].[ext]?[hash]'
    //   : '[name].[ext]',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    // roots: [path.resolve(__dirname), '..', './src'],
    // alias: {
    //   '@': path.resolve(__dirname, '..', './src/'),
    //   '@Components': path.resolve(__dirname, '..', './src/components/'),
    //   '@Hooks': path.resolve(__dirname, '..', './src/hooks/'),
    //   '@Pages': path.resolve(__dirname, '..', './src/pages/'),
    //   '@Providers': path.resolve(__dirname, '..', './src/providers/'),
    // },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/i,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.css$/i,
        exclude: /node_modules\/?!(modern-normalize\)\/).*/,
        use: [
          {
            loader: isProductionMode
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            options: {
              esModule: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              esModule: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, '..', './postcss.config.js'),
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      title: 'Free eBooks from Project Gutenberg',
      favicon: path.resolve(__dirname, '..', './public/favicon.ico'),
      template: path.resolve(__dirname, '..', './public/index.html'),
      hash: true,
      scriptLoading: 'defer',
      inject: 'head', // head better for extension
      excludeChunks: ['manifest', 'background'],
    }),
    new MiniCssExtractPlugin({
      filename: isProductionMode ? '[name].[contenthash].css' : '[name].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '..', './public/manifest.json'),
          to: path.resolve(__dirname, '..', './dist/manifest.json'),
        },
      ],
    }),
  ],
};
