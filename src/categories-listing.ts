import * as Handlebars from 'handlebars';
import { CommonService } from './categories.service'
let headerTemplate = require("./templates/handlebars/header.handlebars");


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
        let header = document.querySelector('header');
        header.innerHTML = headerTemplate(context);
    }

}
