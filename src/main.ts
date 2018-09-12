import './assets/styles/styles.scss';
import * as Handlebars from 'handlebars';
import { CategoriesListingComponent } from './categories-listing';
import { TagsListingComponent } from './tags-listing';

// let headerTemplate = require("./templates/handlebars/header.handlebars");

class App {

    constructor() {
        this.init();
    }

    init() {
        let categoryListing = new CategoriesListingComponent();
        let tagListing = new TagsListingComponent();

        /* Handlebars.registerPartial(
            'partialTemplate',
            '{{language}} is {{adjective}}. You are reading this article on {{website}}.'
          );

          var context={
            "language" : "Handlebars",
            "adjective": "awesome"
          } */
    }

}

const app = new App();
