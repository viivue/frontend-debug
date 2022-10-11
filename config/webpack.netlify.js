const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const {paths, packageInfo, bannerConfig} = require('./config')
const path = require("path");

module.exports = {
    mode: 'production',
    devtool: false,
    entry: paths.entry,
    output: {
        path: paths.build,
        filename: `script.js`, // this is for backward compatibility, not a good practice though
        library: `${packageInfo.codeName}`,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        // prevent error: `Uncaught ReferenceError: self is not define`
        globalObject: 'this',
    },
    plugins: [
        new webpack.BannerPlugin(bannerConfig)
    ],
    optimization: {
        minimizer: [new TerserPlugin({extractComments: false})],
    },
};