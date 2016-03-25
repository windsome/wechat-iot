module.exports = {
  entry: {
    DeviceScan: './src/DeviceScan.jsx'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['react','es2015', 'stage-2']
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
