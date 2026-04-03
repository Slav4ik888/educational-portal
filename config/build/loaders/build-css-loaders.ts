import MiniCssExtractPlugin from 'mini-css-extract-plugin';


export const buildCssLoaders = (isDev: boolean) => ({
  test: /\.s?[ac]ss$/i,
  use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          auto                   : (resPath: string) => resPath.includes('.module.scss'),
          exportLocalsConvention : 'camelCase',
          localIdentName         : isDev
            ? '[path][name]__[local]--[hash:base64:5]'
            : '[hash:base64:8]',
        }
      }
    },
    'sass-loader'
  ]
});
