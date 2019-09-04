/** export the configuration object for webpack 
 * 1. entry point: where webpack starts the bundling: where it will start looking
 * for all the dependencies that it should bundle
 * 
 * 2. output: exactly where to save our bundle file.
 * To access absolute path, need to use a built-in node package.
 * Development mode: writing code without minifying code. 
 * Production mode: minimization, tree shaking, to reduce final bundle size.
 * 3. loaders: allow us to import (load) different files, and to process them:
 * converting sass to css code, convert es6 to es5 javascript
 * babel will do this conversion from es6 to es5
 * 4. plugins: allow us to do complex processing of our input files
 * 
 * webpack provides a development server, that bundles javascript files and then 
 * reload app in browser whenever we change a file.
 */

//to include a built-in node module
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    /** we have one bundle in the end of polyfills from es6 code and our own index.js code */
    entry: ['./src/js/index.js'],
    output: {
        /** join current absolute path with the one we want bundle to be in */
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    /** configure the dev server */
    devServer: {
        /** specify the folder webpack serves our files. Source folder
         * is for development, dist is for production (distribution)
         * which then gets compiled (bundled) into distribution folder
         * so that's why we server the dist
         */
        contentBase: './dist'
    },
    
    /** receives an array of all plugins we're using */
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
}; 