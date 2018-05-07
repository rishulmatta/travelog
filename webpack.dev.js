const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: "development",
    devtool: "source-map",
    devServer: {
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                secure: false
            }
        }
    }
});
