import { Configuration } from 'webpack';
import { buildDevServer } from './build-dev-server';
import { buildLoaders } from './build-loaders';
import { buildPlugins } from './build-plugins';
import { buildResolvers } from './build-resolvers';
import { BuildOptions } from './types';


export function buildWebpackConfig(options: BuildOptions): Configuration {
  const { mode, paths, isDev } = options;

  return {
    mode,
    entry  : paths.entry,
    module : {
      rules: buildLoaders(options)
    },
    resolve : buildResolvers(options),
    output  : {
      filename      : '[name].[contenthash].js',
      chunkFilename : '[name].[contenthash].js',
      path          : paths.build,
      clean         : true,
      publicPath    : '/'
    },
    plugins   : buildPlugins(options),
    devtool   : isDev ? 'inline-source-map' : undefined,
    devServer : isDev ? buildDevServer(options) : undefined
  }
}
