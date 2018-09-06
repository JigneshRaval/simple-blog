const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const frontMatter = require('front-matter');

const MarkdownConvertor = () => {
    console.log('Initiated Markdown Convertor...');
    // Markdown file converter
    const converter = new showdown.Converter();

    // Assuming I add a bunch of .md files in my ./md dir.
    const MARKDOWN_FILE_DIR = './src/pages';
    const MARKDOWN_OUTPUT_DIR = './dist/pages/';
    const ASSETS_PATH = './src/assets'

    // Check if MARKDOWN_OUTPUT_DIR is exist, if not then create directory first
    if (!fs.existsSync(MARKDOWN_OUTPUT_DIR)) {
        fs.mkdirSync('dist');
        fs.mkdirSync(MARKDOWN_OUTPUT_DIR);
    }

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
    const markdownFilesData = fs
        // Read directory contents
        .readdirSync(MARKDOWN_FILE_DIR)
        // Take only .md files
        .filter(filename => /\.md$/.test(filename))
        // Normalize file data.
        .map(filename => {
            let fileNameWithoutExt = filename.split('.')[0];

            /* let frontmatter = frontMatter(fs.readFileSync(
                path.join(MARKDOWN_FILE_DIR, fileNameWithoutExt + '.md'), "utf8"
            ));
            console.log('Front Matter ::', frontmatter); */

            return {
                markdown: fs.readFileSync(
                    path.join(MARKDOWN_FILE_DIR, fileNameWithoutExt + '.md'), "utf8"
                ),
                frontmatter: frontMatter(fs.readFileSync(
                    path.join(MARKDOWN_FILE_DIR, fileNameWithoutExt + '.md'), "utf8"
                )),
                filename,
                fileNameWithoutExt
            }
        });


    /* markdownFilesData.map((data) => {
        let matter = frontMatter(data.markdown);
        let html = converter.makeHtml(data.markdown);
        fs.writeFile(`./dist/pages/${data.fileNameWithoutExt + '.html'}`, matter.body, function (err, data) {
            if (err) console.log(err);
        });
    }) */


    /* const makeHtmlConfig = ({ filename, markdown }) => ({
        cache: true,
        chunks: ['main'],
        template: './src/index.html',
        filename: `pages/${filename}.html`, //relative to root of the application
        title: `Page Number ${n}`,
        header: headerTemplate,
        footer: footerTemplate,
        // Parses the markdown string and converts to HTML string
        bodyHTML: converter.makeHtml(data.markdown)
    }); */

    return markdownFilesData;
}

module.exports = MarkdownConvertor;
