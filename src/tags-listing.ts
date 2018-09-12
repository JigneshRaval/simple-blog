import * as Handlebars from 'handlebars';
import { CommonService } from './categories.service'
let indexTemplate = require("./templates/handlebars/index.handlebars");

export class TagsListingComponent {
    public uniqeTags: any;
    public context: any = {}

    constructor(private commonService = new CommonService()) {
        this.getUniqueTags();

        // this.filterPostsByTag('React')
    }

    getUniqueTags() {
        this.commonService.getCategories().then((data: any) => {

            this.uniqeTags = data.posts.reduce((uniqtags: any, post: any) => {

                post.tags.forEach((tag: string) => {
                    if (uniqtags.indexOf(tag) === -1) {
                        uniqtags.push(tag);
                    }
                });

                return uniqtags;
            }, []);

            this.displayTags(this.uniqeTags)
        });
    }

    displayTags(tags: any) {
        // Create handlebar partials for Tag display and inject into index.handlebars
        let context = {
            tags: tags
        }
        /* Handlebars.registerPartial("tags", `<nav class="my-2 my-md-0 mr-md-3">
        {{#each tags}}
        <a class="p-2 text-dark" href="/pages/{{this}}/index.md.html">
            {{this}}
        </a>
        {{/each}}
    </nav>`); */

        let taglist = document.querySelector('.tag-list');
        taglist.innerHTML = indexTemplate(context);
    }

    /* filterPostsByTag(tagName: string) {
        this.commonService.getCategories().then((data: any) => {
            console.log('DATA ---- : ', data)
            let post = data.posts.filter((post: any) => {

                if (post.tags.includes(tagName)) {
                    return post
                }
            });

            console.log('Posts :', post);
        });
    } */

}
