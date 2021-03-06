module.exports = {
  entry: {
    IotPage2: './src/iot1/IotPage2.jsx'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: [
            'transform-runtime'
          ],
          presets: ['react','es2015', 'stage-0']
        }
      }
    ]
  },
  resolve: {
    alias: {
      "highcharts-more" : "highcharts/highcharts-more.src.js",
      "react-highcharts": 'react-highcharts/dist'
    },
    modulesDirectories: ['node_modules']
  },
  output: {
    path: 'dist/',
    filename: '[name].js',
    publicPath: '/'
  }
};
