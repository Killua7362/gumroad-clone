// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/commonWebpackConfig.js

// Common configuration applying to client and server configuration
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { generateWebpackConfig, merge } = require('shakapacker');
const path = require('path');

const commonOptions = {
    resolve: {
        extensions: ['.css', '.ts', '.tsx', '.js'],
        alias: {
            '@': path.resolve(__dirname, '../../client'),
        },
    },
    plugins: [
        new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, '../../tsconfig.json'),
        }),
        new ForkTsCheckerWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css?$/,
                exclude: /node_modules/,
                use: ['postcss-loader', 'style-loader'],
            },
            {
                test: /\.([cm]?ts|tsx)$/,
                loader: 'ts-loader',
                options: {
                    context: path.resolve(__dirname, '../../'),
                    configFile: path.resolve(__dirname, '../../tsconfig.json'),
                },
            },
        ],
    },
};

const baseClientWebpackConfig = generateWebpackConfig();
// Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
const commonWebpackConfig = () =>
    merge({}, baseClientWebpackConfig, commonOptions);

module.exports = commonWebpackConfig;
