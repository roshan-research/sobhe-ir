const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

module.exports = (env, options) => {
    const inProduction = (options.mode === 'production');

    return {
        entry: {
            main: ['./src/js/index.js', './src/scss/main.scss']
        },
        // output: {
        //     path: path.resolve(__dirname, 'dist'),
        //     filename: '[name].[chunkhash:5].js'
        // },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader",
                            options: {
                                minimize: inProduction
                            }
                        }
                    ]
                },
                {
                    test: /\.s[ac]ss$/,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader",
                        "sass-loader",
                        "import-glob-loader"
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.svg$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'svg/[name].[ext]',
                        }
                    }
                },
                {
                    test: /\.jpe?g$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]',
                        }
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html"
            }),
            new HtmlWebpackInlineSVGPlugin(),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css"
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: inProduction,
                options: {
                    postcss: [
                        autoprefixer()
                    ]
                }
            })
        ]
    }
};