/*
 * Copyright (C) 2024 brittni and the polar bear LLC.
 *
 * This file is a part of brittni and the polar bear's rainbow waves algorithmic art project,
 * which is released under the GNU Affero General Public License, Version 3.0.
 * You may not use this file except in compliance with the license.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. See LICENSE or go to
 * https://www.gnu.org/licenses/agpl-3.0.en.html for full license details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * The visual outputs of this source code are licensed under the
 * Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
 * You should have received a copy of the CC BY-NC-ND 4.0 License with this program.
 * See OUTPUT-LICENSE or go to https://creativecommons.org/licenses/by-nc-nd/4.0/
 * for full license details.
 */

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// TODO - test color imports as peer dependencies in genart

module.exports = {
    entry: {
        sketch: {
            import: './src/main/sketch.ts',
            dependOn: [ 'p5', 'genart', 'nearestColor', 'cococh', 'colorNameList' ]
        },
        genart: {
            import: '@batpb/genart',
            dependOn: [ 'p5', 'nearestColor', 'cococh', 'colorNameList' ]
        },
        p5: 'p5',
        nearestColor: 'nearest-color',
        cococh: 'cococh',
        colorNameList: 'color-name-list/dist/colornames.json'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.json' ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'rainbow waves',
            inject: 'body',
            favicon: './assets/icon/favicon.ico'
        }),
        new MiniCssExtractPlugin()
    ],
    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    output: {
        path: path.resolve(__dirname, 'out/dist'),
        filename: '[name].[fullhash:8].js',
        sourceMapFilename: '[name].[fullhash:8].map',
        chunkFilename: '[name].[fullhash:8].js',
        clean: true
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'out/dist')
        },
        client: {
            overlay: true
        },
        compress: true,
        host: '127.0.0.1',
        port: 8080,
        hot: false,
        liveReload: false,
        open: true,
        webSocketServer: false
    }
};
