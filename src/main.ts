import './assets/styles/main.scss';
import * as Handlebars from 'handlebars';
import { CategoriesListingComponent } from './categories-listing';
import { TagsListingComponent } from './tags-listing';

declare var $: any

class App {

    constructor() {
        this.init();
    }

    init() {
        let categoryListing = new CategoriesListingComponent();
        let tagListing = new TagsListingComponent();

        // Highlight code blocks
        $(document).ready(function () {
            $('pre code').each(function (i: any, block: any) {
                (<any>window).hljs.highlightBlock(block);
            });
        });
    }

}

const app = new App();
