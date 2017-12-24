var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
const bootstrapEntryPoints = require('../webpack.bootstrap.config.js');

var isProd = process.env.NODE_ENV === 'production';
var bootStrapConfig = isProd ? bootstrapEntryPoints.prod:bootstrapEntryPoints.dev;
module.exports = {
    entry: {
        /* bootstrap: bootStrapConfig,
        polyfills: './src/polyfills.ts',
        vendor: './src/vendor.ts',
        app: isProd ? './src/main.aot.ts' : './src/main.ts' */
        app:[bootStrapConfig,'./src/polyfills','./src/vendor', isProd ? './src/main.aot.ts' : './src/main.ts' ]
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [{
                test: /\.ts$/,
                loaders: [
                    'babel-loader',
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: isProd ?
                                helpers.root('tsconfig-aot.json') :
                                helpers.root('tsconfig.json')
                        }
                    },
                    'angular2-template-loader'
                ],
                exclude: [/node_modules/]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/,
                loader: 'file-loader?name=images/[name].[ext]'
            },
            {
                test: /\.(woff|woff2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?name=fonts/[name].[ext]',
              },
              { test: /\.(ttf|eot)$/, use: 'file-loader?name=fonts/[name].[ext]' },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader?sourceMap'
                })
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw-loader'
            },
            { test: /bootstrap\/dist\/js\/umd\//, use: 'imports-loader?jQuery=jquery' }
        ]
    },

    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        ),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app'/* , 'vendor', 'polyfills','bootstrap' */]
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
            Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
            Button: "exports-loader?Button!bootstrap/js/dist/button",
            Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
            Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
            Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
            Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
            Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
            Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
            Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
            Util: "exports-loader?Util!bootstrap/js/dist/util"
          }),

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};