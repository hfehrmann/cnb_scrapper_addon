const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { NormalModuleReplacementPlugin } = require( 'webpack' );

function modifyManifest(buffer, mode) {
  if (mode == 'development') {
    var manifest = JSON.parse(buffer.toString());
    delete manifest.browser_specific_settings;
    return JSON.stringify(manifest, null, 2);
  } else {
    return buffer
  }
}

module.exports = (env, args) => {
  const baseSrc = path.resolve(__dirname, 'src');
  const popupDir = path.resolve(baseSrc, 'popup');
  const mode = args.mode ? args.mode : 'development';
  const contentScriptDir = path.resolve(baseSrc, 'content_scripts');
  const iconPath = mode == 'production' ? 'prod' : 'development';
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
    resolve: {
      modules: [
        path.resolve('./src'),
        path.resolve('./node_modules')
      ]
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
          {
            from: path.resolve(baseSrc, 'manifest.json'),
            to: 'manifest.json',
            transform(content, absoluteFrom) {
              return modifyManifest(content, mode);
            },
          },
          {
            from: path.resolve(baseSrc, `icons/${iconPath}/*`),
            to: "icons/[name][ext]",
          },
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
