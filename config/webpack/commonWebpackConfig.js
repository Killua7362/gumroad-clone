// The source code including full typescript support is available at: 
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/commonWebpackConfig.js

// Common configuration applying to client and server configuration
const { generateWebpackConfig, merge } = require('shakapacker');

const commonOptions = {
	resolve: {
		extensions: ['.css', '.ts', '.tsx']
	},
	module: {
		rules: [
			{
				test: /\.css?$/,
				exclude: /node_modules/,
				use: [
					'postcss-loader',
					'style-loader'
				]
			}
		]
	}
};


const baseClientWebpackConfig = generateWebpackConfig();
// Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
const commonWebpackConfig = () => merge({}, baseClientWebpackConfig, commonOptions);

module.exports = commonWebpackConfig;
