import MiniCssExtractPlugin from 'mini-css-extract-plugin';


export const buildCssLoaders = (isDev: boolean) => ({
  test: /\.scss$/,
  oneOf: [
    {
      // Для CSS модулей (файлы с .module.scss)
      test: /\.module\.scss$/,
      use: [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: isDev
                ? '[path][name]__[local]--[hash:base64:5]'
                : '[hash:base64:8]',
              namedExport: false,
            },
            sourceMap: isDev,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: isDev,
          },
        },
      ],
    },
    {
      // Для обычных SCSS файлов (не модулей)
      use: [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: isDev,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: isDev,
          },
        },
      ],
    },
  ],
});
