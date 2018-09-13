const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');


const MarkdownConvertor = () => {
    console.log('Initiated Markdown Convertor...');

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

module.exports = MarkdownConvertor;
