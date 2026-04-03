import path from 'path';
import { Configuration } from 'webpack';
import { buildWebpackConfig } from './config/build/build-webpack-config';
import { BuildEnv, BuildPaths, BuildProject } from './config/build/types';


export default (env: BuildEnv) => {
  const paths: BuildPaths = {
    entry   : path.resolve(__dirname, 'src', 'index.tsx'),
    build   : path.resolve(__dirname, 'build'),
    html    : path.resolve(__dirname, 'public', 'index.html'),
    favicon : path.resolve(__dirname, 'public', 'favicon.png'),
    src     : path.resolve(__dirname, 'src'),
  };

  const { port, apiUrl, isAnal, mode = 'development' } = env;
  const isDev = mode === 'development';
  const project = BuildProject.FRONTEND;

  const config: Configuration = buildWebpackConfig({
    mode,
    paths,
    isDev,
    isAnal,
    port,
    apiUrl,
    project
  });

  return config;
}
