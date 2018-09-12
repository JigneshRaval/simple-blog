import * as Handlebars from 'handlebars';
import { CommonService } from './categories.service'
let tagsTemplate = require("./templates/handlebars/tags.handlebars");

export class TagsListingComponent {
    public uniqeTags: any;
    // public context: any = {}

    constructor(private commonService = new CommonService()) {
        this.getUniqueTags();
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

        let taglistContainer = document.querySelectorAll('.tags-wrapper');
        [].forEach.call(taglistContainer, (container) => {
            container.innerHTML = tagsTemplate(context);

        })
        // taglist.innerHTML = tagsTemplate(context);

    }

}
