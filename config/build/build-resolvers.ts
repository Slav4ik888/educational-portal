import { ResolveOptions } from 'webpack';
import { BuildOptions } from './types';


export function buildResolvers(options: BuildOptions): ResolveOptions {
  return {
    extensions     : ['.tsx', '.ts', '.js'],
    preferAbsolute : true,
    modules        : [options.paths.src, 'node_modules'],
    mainFiles      : ['index'],
    alias          : {},
    fallback       : {
      // "path": require.resolve("path-browserify"),
      // "os": require.resolve("os-browserify/browser"),
      // "crypto": require.resolve("crypto-browserify"),
      // "vm": require.resolve("vm-browserify"),
      // "buffer": require.resolve("buffer/"),
      // "stream": require.resolve("stream-browserify"),
      // "fs": false,
      // "path": false,
      // "url": false,
      // "buffer": false,
      // "util": false,
      // "os": false,
      // "zlib": false,
      // "http": false,
      // "https": false,
      events: false
    }
  }
}
