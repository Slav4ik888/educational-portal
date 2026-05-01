import { Configuration as DevServerConfiguraion } from 'webpack-dev-server';
import { BuildOptions } from './types';

export const buildDevServer = ({ port, apiUrl }: BuildOptions): DevServerConfiguraion => ({
  port,
  host               : '0.0.0.0',
  open               : false,
  hot                : true,
  historyApiFallback : true,
  allowedHosts       : 'all',
  proxy: [
    {
      context: ['/api'],
      target: apiUrl
    }
  ]
});
