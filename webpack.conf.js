module.exports = {
    context: __dirname+"/src",
    entry: './index.js',
    output: {
        filename: './dist/bundle.js',
        path: __dirname,
        // sourceMapFilename: './dist/bundle.js.map',
        // devtoolModuleFilenameTemplate: "[absolute-resource-path]"
    },
    // devtool: 'source-map',
    module: {
        loaders: [{
            // test: /.js$/, loader: 'uglify!babel'
            test: /.js$/, loader: 'ng-annotate!babel-loader'
        },{
            test: /.html$/, loader: 'raw'
        }, {
            test: /\.less$/,
            loader: "style!css!less"
        }, {
            test: /\.css$/,
            loader: "style!css"
        }]
    }
}
