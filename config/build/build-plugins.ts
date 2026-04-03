import HtmlWebpackPlugin from 'html-webpack-plugin';
import { WebpackPluginInstance, DefinePlugin, HotModuleReplacementPlugin, ProgressPlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { BuildOptions } from './types';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';


export function buildPlugins({ paths, isDev, isAnal, apiUrl, project }: BuildOptions): WebpackPluginInstance[] {
  const plugins = [
    new ProgressPlugin(),
    new HtmlWebpackPlugin({
      template : paths.html,
      favicon  : paths.favicon,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      // chunkFilename:
    }),
    new DefinePlugin({
      __IS_DEV__  : JSON.stringify(isDev),
      __API_URL__ : JSON.stringify(apiUrl),
      __PROJECT__ : JSON.stringify(project)
    })
  ];

  if (isDev) {
    plugins.push(new ReactRefreshWebpackPlugin());
    plugins.push(new HotModuleReplacementPlugin());
  }

  if (isAnal) {
    plugins.push(new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static'
    }));
  }

  return plugins
}
