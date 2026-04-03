import { Configuration as DevServerConfiguraion } from 'webpack-dev-server';
import { BuildOptions } from './types';

export const buildDevServer = ({ port, apiUrl }: BuildOptions): DevServerConfiguraion => ({
  port,
  open               : false,
  hot                : true,
  historyApiFallback : true,
  proxy: [
    {
      context: ['/api'],
      target: apiUrl
    }
  ]
});
