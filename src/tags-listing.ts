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

            this.uniqeTags = data.posts.map((post: any) => post.tags)
                .reduce((allTags: any, tags: any) => allTags.concat(tags), [])
                .reduce((uniqtags: any, tag: any) => {
                    uniqtags[tag] = (uniqtags[tag] || 0) + 1
                    return uniqtags;
                }, {});

            this.displayTags(this.uniqeTags)
        });
    }

    displayTags(tags: any) {
        // Create handlebar partials for Tag display and inject into index.handlebars
        let context = {
            tags: tags
        }

        let taglistContainer = document.querySelectorAll('.tags-wrapper');
        [].forEach.call(taglistContainer, (container: any) => {
            container.innerHTML = tagsTemplate(context);

        })
        // taglist.innerHTML = tagsTemplate(context);

    }

}
