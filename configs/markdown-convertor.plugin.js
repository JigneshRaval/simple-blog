const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const myTest = require('./example');


class MarkdownConvertorPlugin {
    constructor(options) {
        this.options = options;
    }

    // TODO: Created for watching .md files, but not working
    apply(compiler) {
        if (compiler.hooks) {
            console.log("======= MarkdownConvertorPlugin : Compiler Hooks ===========");
            var plugin = { name: 'MarkdownConvertorPlugin' };

            /* compiler.hooks.compilation.tap('MarkdownConvertorPlugin', (compilation) => {
                console.log("======= MarkdownConvertorPlugin : htmlWebpackPluginBeforeHtmlProcessing ===========");

                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('MarkdownConvertorPlugin', (data, cb) => {
                    console.log("MarkdownConvertorPlugin : htmlWebpackPluginBeforeHtmlProcessing Inner ===========");

                    // Run HTML through a series of user-specified string replacements.
                    Object.keys(this.options).forEach(key => {
                        console.log(this.options, '==========', key)
                        const value = this.options[key];
                        data.html = data.html.replace(
                            new RegExp('%' + key + '%', 'g'),
                            value
                        );
                    });


                    console.log('==================== data ============\n\n', data)
                    cb(null, data)
                });
            }); */

            // Executes a plugin during watch mode after a new compilation is triggered
            // but before the compilation is actually started.
            /* compiler.hooks.watchRun.tap('MarkdownConvertorPlugin', (compilation, callback) => {
                console.log("======= MarkdownConvertorPlugin : watchRun ===========");
                console.log('=========== compilation.fileDependencies :: ', compilation.fileDependencies);
                let finalDataObj = this.compileMarkdownFiles();
                this.options.test(finalDataObj);
                if (callback) {
                    callback(finalDataObj);
                }
            }) */

            // Before emitting assets to output dir
            /* compiler.hooks.emit.tapAsync('MarkdownConvertorPlugin', (compilation, done) => {
                console.log("======= MarkdownConvertorPlugin : Compiler Hooks : EMIT ===========");
                done();
            }); */

            compiler.hooks.afterEmit.tapAsync('MarkdownConvertorPlugin', (compilation, done) => {
                // console.log("======= MarkdownConvertorPlugin : Compiler Hooks : AFTER EMIT ===========");

                /* let finalDataObj = this.compileMarkdownFiles();
                this.options.test(finalDataObj);

                let compilationFileDependencies;
                let addFileDependency;
                if (Array.isArray(compilation.fileDependencies)) {
                    compilationFileDependencies = new Set(compilation.fileDependencies);
                    finalDataObj.map(({ file }) => {
                        let filePath = path.resolve(__dirname, `../${file}`)
                        // console.log('File =============== :', file, ' ======= ', filePath);
                        // compilation.fileDependencies.push(filePath);
                        addFileDependency = (filePath) => compilation.fileDependencies.push(filePath);
                    });
                    // console.log('=========== compilationFileDependencies :: ', compilationFileDependencies);
                } else {
                    compilationFileDependencies = compilation.fileDependencies;
                    // console.log('=========== compilationFileDependencies :: ', compilationFileDependencies);
                    finalDataObj.map(({ file }) => {
                        let filePath = path.resolve(__dirname, `../${file}`)
                        // console.log('File =============== :', file, ' ======= ', filePath);
                        // compilation.fileDependencies.add(filePath);
                        addFileDependency = (filePath) => compilation.fileDependencies.add(filePath);
                    })

                }

                // Add file dependencies if they're not already tracked
                finalDataObj.map(({ file }) => {
                    let filePath = path.resolve(__dirname, `../${file}`);

                    if (compilationFileDependencies.has(filePath)) {
                        console.log(`1. Not adding ${filePath} to change tracking, because it's already tracked`);
                    } else {
                        console.log(`2. Adding ${filePath} to change tracking`);
                        addFileDependency(filePath);
                    }
                }); */



                // Add file dependencies if they're not already tracked
                /* for (const file of compilation.fileDependencies) {
                    if (compilationFileDependencies.has(file)) {
                        console.log(`not adding ${file} to change tracking, because it's already tracked`);
                    } else {
                        console.log(`adding ${file} to change tracking`);
                        addFileDependency(file);
                    }
                } */

                // console.log('=========== compilationFileDependencies :: ', compilationFileDependencies);


                /* let compilationContextDependencies;
                let addContextDependency;
                if (Array.isArray(compilation.contextDependencies)) {
                    compilationContextDependencies = new Set(compilation.contextDependencies);
                    addContextDependency = (file) => compilation.contextDependencies.push(file);
                } else {
                    compilationContextDependencies = compilation.contextDependencies;
                    addContextDependency = (file) => compilation.contextDependencies.add(file);
                }

                // Add file dependencies if they're not already tracked
                for (const file of fileDependencies) {
                    if (compilationFileDependencies.has(file)) {
                        debug(`not adding ${file} to change tracking, because it's already tracked`);
                    } else {
                        debug(`adding ${file} to change tracking`);
                        addFileDependency(file);
                    }
                } */

                /* // Add context dependencies if they're not already tracked
                for (const context of contextDependencies) {
                    if (compilationContextDependencies.has(context)) {
                        debug(`not adding ${context} to change tracking, because it's already tracked`);
                    } else {
                        debug(`adding ${context} to change tracking`);
                        addContextDependency(context);
                    }
                } */

                // myTest();
                done();
            });
        } else {
            compiler.plugin("done", () => {
                console.log("======= MarkdownConvertorPlugin ===========");
            })
        }
    }

    compileMarkdownFiles() {
        console.log('Initiated Markdown Convertor from plugin ...');

        // Assuming I add a bunch of .md files in my ./pages dir.
        const MARKDOWN_FILE_DIR = './src/pages';
        const MARKDOWN_OUTPUT_DIR = './dist/pages/';

        // Check if MARKDOWN_OUTPUT_DIR is exist, if not then create directory first
        if (!fs.existsSync(MARKDOWN_OUTPUT_DIR)) {
            if (!fs.existsSync('dist')) { fs.mkdirSync('dist'); }

            fs.mkdirSync(MARKDOWN_OUTPUT_DIR);
        }

        const walkDirSync = (dir) => fs.readdirSync(dir)
            .reduce((filelist, file) => {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    return filelist.concat(walkDirSync(path.join(dir, file), filelist));
                } else {
                    return filelist.concat(path.join(dir, file));
                }
            }, [])

        /*
        * Generates an Array with the following data:
        * [
        *   {
        *     filename: '{markdownFilename}.md',
        *     markdown: '{ markdownString }`,
        *     fileNameWithoutExt: '{markdownFilename}',
        *     frontmatter: { attributes : {}, body }
        *   }
        * ]
        */
        let markdownFilesData = walkDirSync(MARKDOWN_FILE_DIR);

        let finalData = markdownFilesData
            .filter(file => /\.md$/.test(file))
            .map(file => {
                let fileNameWithoutExt = path.basename(file).split('.')[0];

                return {
                    markdown: fs.readFileSync(
                        path.join(process.cwd(), file), "utf8"
                    ),
                    frontmatter: frontMatter(fs.readFileSync(
                        path.join(process.cwd(), file), "utf8"
                    )),
                    file,
                    fileName: path.basename(file),
                    filePath: file.substring(file.indexOf('\\')),
                    fileNameWithoutExt
                }
            })

        return finalData;
    }
}

module.exports = MarkdownConvertorPlugin;
