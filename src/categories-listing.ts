// import * as Handlebars from 'handlebars';
import { CommonService } from './categories.service'
let headerTemplate = require("./templates/handlebars/header.handlebars");
let categoryTemplate = require("./templates/handlebars/categories.handlebars");

export class CategoriesListingComponent {
    public uniqeCategories: any;
    // public context: any = {};

    constructor(private commonService = new CommonService()) {
        this.getUniqueCategories();
    }

    getUniqueCategories() {
        this.commonService.getCategories().then((data: any) => {

            this.uniqeCategories = data.posts.reduce((uniqcats: any, post: any) => {
                if (uniqcats.indexOf(post.category) === -1) {
                    uniqcats.push(post.category);
                }
                return uniqcats;
            }, []);

            this.displayCategories(this.uniqeCategories)
        });
    }

    displayCategories(categories: any) {
        /* var source = document.querySelector("header").innerHTML;
        var template = Handlebars.compile(source);
        var context = { title: "My New Post", body: "This is my first post!" };
        var html = template(context);
        $('#handlebars-output').html(html); */

        let context = {
            categories: categories
        }

        // Generate list of tags in the sidebar panel
        let categoryListContainer = document.querySelectorAll('.category-wrapper');
        if (categoryListContainer) {
            [].forEach.call(categoryListContainer, (container: any) => {
                container.innerHTML = categoryTemplate(context);
            });
        }

        let header = document.querySelector('header');
        if (header) {
            header.innerHTML = headerTemplate(context);
        }
    }

}
