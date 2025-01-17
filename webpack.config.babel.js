import webpack from 'webpack';
import path from 'path';

const { NODE_ENV } = process.env;

const plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
];

const filename = `vue-ewd${NODE_ENV === 'production' ? '.min' : ''}.js`;

NODE_ENV === 'production'  && plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      screw_ie8: true,
      warnings: false,
    },
  })
);

export default {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
    ],
  },

  entry: [
    './src/index',
  ],

	externals: {
		'jquery': '$',
		'socket.io-client': 'io',
		'vue': 'Vue',
		'ewd-client': 'EWD'
	},
	
  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'VueEWD',
    libraryTarget: 'umd',
  },

  plugins,
};
