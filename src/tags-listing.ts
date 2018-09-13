import * as Handlebars from 'handlebars';
import { CommonService } from './categories.service'
import { Utils } from './utils';

let tagsTemplate = require("./templates/handlebars/tags.handlebars");

export class TagsListingComponent {
    public uniqeTags: any;
    // public context: any = {}

    constructor(
        private commonService = new CommonService(),
        private utils = new Utils()
    ) {
        this.getUniqueTags();
    }

    getUniqueTags() {
        this.commonService.getCategories().then((data: any) => {
            if (data) {
                this.uniqeTags = data.posts.map((post: any) => post.tags)
                    .reduce((allTags: any, tags: any) => allTags.concat(tags), [])
                    .reduce((uniqtags: any, tag: any) => {
                        uniqtags[tag] = (uniqtags[tag] || 0) + 1
                        return uniqtags;
                    }, {});

                this.displayTags(this.uniqeTags);
            } else {
                console.log('getUniqueTags : data is not available')
            }
        });
    }

    displayTags(tags: any) {
        // Create handlebar partials for Tag display and inject into index.handlebars
        let context = {
            tags: tags
        }

        // Generate list of tags in the sidebar panel
        let taglistContainer = document.querySelectorAll('.tags-wrapper');
        [].forEach.call(taglistContainer, (container: any) => {
            container.innerHTML = tagsTemplate(context);
        })

        // Toggle sidebar panel
        let toggleSideBarLink = document.querySelector('#toggleSidebar');
        if (toggleSideBarLink) {
            console.log('Toggle sidebar');
            toggleSideBarLink.addEventListener('click', (event) => {
                this.utils.toggleSidebarPanel(event);
            });
        }

    }

}
