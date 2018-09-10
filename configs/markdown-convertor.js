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
    /*  const markdownFilesData = fs
         // Read directory contents
         .readdirSync(MARKDOWN_FILE_DIR)
         // Take only .md files
         .filter(filename => /\.md$/.test(filename))
         // Normalize file data.
         .map(filename => {
             console.log('1 . filename :', filename);

             let fileNameWithoutExt = filename.split('.')[0];
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
  */
    const walkSync = (dir) => fs.readdirSync(dir)
        .reduce((filelist, file) => {
            // let fileNameWithoutExt = file.split('.')[0];
            console.log('Walksync :', filelist, file);

            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                return filelist.concat(walkSync(path.join(dir, file), filelist));
            } else {
                console.log('File List 123 :', filelist);
                return filelist.concat(path.join(dir, file));
            }
        }, [])
    /* .reduce(function (prev, curr) {
        return prev.concat(curr);
    })
    // Normalize file data.
    .map(filename => {
        console.log('2 . Mapping....... :', filename);

        if (filename) {
            let fileNameWithoutExt = filename.split('.')[0];
            return {
                markdown: fs.readFileSync(
                    path.join(filename), "utf8"
                ),
                frontmatter: frontMatter(fs.readFileSync(
                    path.join(filename), "utf8"
                )),
                filename,
                fileNameWithoutExt
            }
        }
    }) */
    /*  const walkDirSync = (directory, fileList = []) => {
         fs
             // Read directory contents
             .readdirSync(directory)
             // Take only .md files
             .filter(filename => {
                 if (fs.statSync(directory + "/" + filename).isDirectory()) {
                     console.log('Is Directory :');
                     fileList = walkDirSync(directory + '/' + filename, fileList);
                 } else {
                     console.log('Not Directory :');
                     fileList.push(filename);
                     return /\.md$/.test(filename)
                 }
             })
             // Normalize file data.
             .map(filename => {
                 let fileNameWithoutExt = filename.split('.')[0];
                 return {
                     markdown: fs.readFileSync(
                         path.join(MARKDOWN_FILE_DIR, fileNameWithoutExt + '.md'), "utf8"
                     ),
                     frontmatter: frontMatter(fs.readFileSync(
                         path.join(MARKDOWN_FILE_DIR, fileNameWithoutExt + '.md'), "utf8"
                     )),
                     filename,
                     fileNameWithoutExt
                 }, fileList
             });
     }

     walkDirSync(MARKDOWN_FILE_DIR); */

    let markdownFilesData = walkSync(MARKDOWN_FILE_DIR);

    let finalData = markdownFilesData
        .filter(filename => /\.md$/.test(filename))
        .map(filename => {

            let frontmatter = frontMatter(fs.readFileSync(
                path.join(process.cwd(), filename), "utf8"
            ));

            let fileNameWithoutExt = filename.split('.')[0];
            return {
                markdown: fs.readFileSync(
                    path.join(process.cwd(), filename), "utf8"
                ),
                frontmatter: frontMatter(fs.readFileSync(
                    path.join(process.cwd(), filename), "utf8"
                )),
                filename,
                fileNameWithoutExt
            }
            //}
        })

    return finalData;
}

module.exports = MarkdownConvertor;
