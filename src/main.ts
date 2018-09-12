import './assets/styles/styles.scss';
import * as Handlebars from 'handlebars';
import { CategoriesListingComponent } from './categories-listing';
import { TagsListingComponent } from './tags-listing';


class App {

    constructor() {
        this.init();
    }

    init() {
        let categoryListing = new CategoriesListingComponent();
        let tagListing = new TagsListingComponent();
    }

}

const app = new App();
