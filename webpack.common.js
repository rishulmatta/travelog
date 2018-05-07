const path = require("path");

// the source dir structure
const dir = require("./client/config/paths").dirs;
const alias = require("./client/config/paths").alias;

// Set of plugins used.
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const extractText = ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: ["css-loader", "sass-loader"]
});
const htmlPlugin = new HtmlWebPackPlugin({
    template: `${dir.client}/index.html`,
    filename: `${dir.dist}/index.html`
});

module.exports = {
    mode: "development",
    entry: path.resolve(`${dir.client}/index.js`),
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: [".js", ".jsx"]
                },
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'stage-1', 'react']
                        }
                    }
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: false,
                            importLoaders: 1,
                            sourceMap: true,
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    resolve: {
        alias: alias,
    },
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "client/dist"),
    },
    plugins: [htmlPlugin],
    devServer: {
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                secure: false
            }
        }
    }
};
