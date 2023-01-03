const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { NormalModuleReplacementPlugin } = require( 'webpack' );

module.exports = (env) => {
  const baseSrc = path.resolve(__dirname, 'src');
  const popupDir = path.resolve(baseSrc, 'popup');
  const contentScriptDir = path.resolve(baseSrc, 'content_scripts');
  const iconPath = 'prod';

  const browserType = env.browserType;

  let config;
  if (browserType === 'FIREFOX') {
    config = {
      contentScriptDepSrc: path.resolve(contentScriptDir, 'dependencies', 'firefox.js'),
      baseDist: path.resolve(__dirname, 'dist', 'firefox')
    };
  } else if (browserType === 'CHROME') {
    config = {
      contentScriptDepSrc: path.resolve(contentScriptDir, 'dependencies', 'chrome.js'),
      baseDist: path.resolve(__dirname, 'dist', 'chrome')
    };
  } else {
    throw Error('Not valid browser');
  }

  return {
    entry: {
      popup: path.resolve(popupDir, 'popup.js'),
      scrapper: path.resolve(contentScriptDir, 'scrapper.js'),
    },
    mode: 'production',
    output: {
      filename: '[name].js',
      path: config.baseDist,
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new NormalModuleReplacementPlugin(
        /browser_dep/,
        (resource) => {
          resource.request = config.contentScriptDepSrc
        }
      ),
      new CopyPlugin({
        patterns: [
          { from: path.resolve(baseSrc, 'manifest.json'), to: 'manifest.json' },
          { from: path.resolve(baseSrc, `icons/${iconPath}/*`), to: "icons/[name][ext]", },
        ],
      }),
      new HtmlWebpackPlugin({
        title: 'Output Management',
        filename: 'popup.html',
        template: path.resolve(baseSrc, 'popup/popup.html'),
        chunks: ['popup'],
      }),
    ],
  };
};
