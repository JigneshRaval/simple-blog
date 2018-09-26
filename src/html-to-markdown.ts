// let TurndownService = require("turndown");
export class HtmlToMarkdown {
    turndownService: any;
    editorOutput: any;
    convertedHTML: any;
    postPath: string;

    constructor() {
        this.turndownService = new TurndownService({
            codeBlockStyle: 'fenced',
            fence: '```',
            filter: 'br',
            replacement: function (content: any) {
                return '\n\n' + content + '\n\n'
            }
        });
    }

    init() {
        const formHtmlToMD = document.querySelector("#formHtmltoMd");

        if (formHtmlToMD) {
            formHtmlToMD.addEventListener("submit", e => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }
        const btnResetForm = document.querySelector("#btnResetConvertForm");

        if (btnResetForm) {
            btnResetForm.addEventListener("click", e => {
                //e.preventDefault();
                (formHtmlToMD as HTMLFormElement).reset();
            });
        }

        const txtPostTitle = document.querySelector("#txtPostTitle");
        const txtSavePostToPath = document.querySelector("#txtSavePostToPath");

        if (txtPostTitle) {
            txtPostTitle.addEventListener("blur", e => {
                //e.preventDefault();
                this.postPath = e.target.value.toLowerCase().replace(/[\s:\(\)\[\]_,\*]/gi, '-').replace('--', '-');
                txtSavePostToPath.value = this.postPath;
            });
        }
    }

    // convert HTML code to Markdown formate
    convert(htmlContent: any) {
        if (htmlContent) {
            var markdown = this.turndownService.turndown(htmlContent);

            return markdown;
        } else {
            return null;
        }
    }

    // Handle Html to Markdown form submit
    handleSubmit(event: any) {
        event.preventDefault();

        this.editorOutput = document.querySelector('#txtareaMarkdownCode');

        // Syntax : var formData = new FormData(form)
        // Ref : https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
        const form = event.target;
        const formData = new FormData(form);

        this.convertedHTML = this.convert(formData.get('txtareaHtmlCode'));
        this.editorOutput.value = this.convertedHTML;

        // Tags
        let tags: any = formData.get('txtTags');
        if (tags) {
            tags = tags.split(',');
        }

        /* let fileName = formData.get('txtPostTitle').toLowerCase().replace(/[\s:\(\)\[\]_\*]/gi, '-');
        console.log('fileName ===', fileName);

        formData.set('txtSavePostToPath', fileName); */

        // let fileName = formData.get('txtSavePostToPath').toLowerCase().replace(/[~\!@#$%^&_*\(\)\[\]]/g, '-')


        // FrontMatter Object
        const frontmatterObj = {
            title: formData.get('txtPostTitle'),
            sourceUrl: formData.get('txtWebsiteUrl'),
            path: `${formData.get('txtCategory') + '/'}${formData.get('txtSavePostToPath')}`,
            category: formData.get('txtCategory'),
            tags: tags,
            excerpt: formData.get('txtExcerpt'),
            date: formData.get('txtPostDate'),
            coverImage: formData.get('txtCoverImage'),
            type: formData.get('txtPostType')
        }

        const frontmatter = this.generateFrontMatter(frontmatterObj);


        // Final Form Object to pass to server
        const formDataObj = {
            'frontmatter': frontmatter,
            'htmlCode': formData.get('txtareaHtmlCode'),
            // Path where to save generated .md file by server.js
            'filePath': `pages/${frontmatterObj.category + '/'}${formData.get('txtSavePostToPath') + '.md'}`,
            'markdownCode': this.convertedHTML,
            'coverImage': formData.get('txtCoverImage'),
            'category': formData.get('txtCategory')
        }

        // Post form data to server
        fetch('/', {
            method: 'POST',
            body: JSON.stringify(formDataObj),
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'application/json'
                //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(`Data returned by server : ${data}`);
            })
            .catch((err) => {
                console.log(`Markdown file generated successfully to ${formDataObj.filePath}.`);
            });


    }

    senitizeInnerHtml(htmlContent: any) {
        let senitizedContent = htmlContent.replace(/style="[^"]*"/g, "");

        return senitizedContent;
    }

    /**
     *
     * @param frontmatterObj
     */
    generateFrontMatter(frontmatterObj: any) {

        let frontMatter = `---
path: "${frontmatterObj.path}"
date: "${frontmatterObj.date}"
title: "${frontmatterObj.title}"
tags: [${frontmatterObj.tags.map(tag => `"${tag.trim()}"`)}]
category: "${frontmatterObj.category}"
categoryColor: "#F3C610"
excerpt: "${frontmatterObj.excerpt}"
coverImage: "${frontmatterObj.coverImage}"
sourceUrl: "${frontmatterObj.sourceUrl}"
type: "${frontmatterObj.type}"
---

`

        return frontMatter;
    }
}
