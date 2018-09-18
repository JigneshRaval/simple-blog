// let TurndownService = require("turndown");
export class HtmlToMarkdown {
    turndownService: any;

    constructor() {
        this.turndownService = new TurndownService();
    }

    init() {
        const formHtmlToMD = document.querySelector("#formHtmltoMd");

        if (formHtmlToMD) {
            formHtmlToMD.addEventListener("submit", e => {
                e.preventDefault();
                this.handleSubmit(e);
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

        let editorOutput = document.querySelector('#txtareaMarkdownCode');

        // Syntax : var formData = new FormData(form)
        // Ref : https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
        const form = event.target;
        const formData = new FormData(form);

        let convertedHTML = this.convert(formData.get('txtareaHtmlCode'))
        editorOutput.value = convertedHTML;

        // Tags
        let tags = formData.get('txtTags');
        if (tags) {
            tags = tags.split(',');
        }

        // let fileName = formData.get('txtSavePostToPath').toLowerCase().replace(/[~\!@#$%^&_*\(\)\[\]]/g, '-')


        // FrontMatter Object
        const frontmatterObj = {
            title: formData.get('txtPostTitle'),
            sourceUrl: formData.get('txtWebsiteUrl'),
            path: `${formData.get('txtCategory') + '/'}}`,
            category: formData.get('txtCategory'),
            tags: tags,
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
            'filePath': `pages/${frontmatterObj.category + '/'}${formData.get('txtSavePostToPath')}`,
            'markdownCode': convertedHTML,
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
tags: [${frontmatterObj.tags.map(tag => `"${tag}"`)}]
category: "${frontmatterObj.category}"
categoryColor: "#F3C610"
excerpt: "Since the advent of the modern web, performance has been a key consideration when designing a website or a web app. When a website requires no server interaction whatsoever, what is hosted on the web is served to a user as is, this is referred to as a static site."
coverImage: "${frontmatterObj.coverImage}"
sourceUrl: "${frontmatterObj.sourceUrl}"
type: "${frontmatterObj.type}"
---

`

        return frontMatter;
    }
}
