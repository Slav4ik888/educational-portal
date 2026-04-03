import { RuleSetRule } from 'webpack';
import { BuildOptions } from './types';
import { buildSvgLoader, buildCssLoaders } from './loaders';
import { buildBabelLoader } from './loaders/build-babel-loader';



export function buildLoaders({ isDev }: BuildOptions): RuleSetRule[] {
  const typescriptLoader = {
    test    : /\.tsx?$/,
    use     : 'ts-loader',
    exclude : /node_modules/
  };

  const babelLoader = buildBabelLoader(isDev);
  const cssLoader   = buildCssLoaders(isDev);
  const svgLoader   = buildSvgLoader();

  const imagesLoader = {
    test : /\.(png|jpe?g|gif|woff|woff2)$/i,
    use  : [
      {
        loader: 'file-loader'
      }
    ]
  };


  return [
    babelLoader,
    typescriptLoader,
    cssLoader,
    svgLoader,
    imagesLoader
  ]
}
