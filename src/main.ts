import './assets/styles/main.scss';
import { Utils } from './utils';
import * as Handlebars from 'handlebars';

import { HtmlToMarkdown } from './html-to-markdown';

import { CategoriesListingComponent } from './categories-listing';
import { TagsListingComponent } from './tags-listing';

declare var $: any

class App {

    constructor(private utils = new Utils()) {
        this.init();
    }

    init() {
        let categoryListing = new CategoriesListingComponent();
        let tagListing = new TagsListingComponent();
        let htmlToMarkdown = new HtmlToMarkdown();

        // Highlight code blocks
        $(document).ready(function () {
            $('pre code').each(function (i: any, block: any) {
                (<any>window).hljs.highlightBlock(block);
            });
        });

        window.addEventListener('scroll', () => {
            this.utils.getScrollPosition('scrollToTop');
        });

        let scrollTopLink = document.querySelector('#scrollToTop');
        if (scrollTopLink) {
            scrollTopLink.addEventListener('click', () => {
                this.utils.sgScrollToTop();
            });
        }

        htmlToMarkdown.init();

        this.utils.generatePagination();

        let toggleTheme = document.querySelector('header');
        if (toggleTheme) {
            toggleTheme.addEventListener('click', (e) => {
                console.log('Toggle Theme', e);
                if (e.target.id === 'toggleTheme') {
                    this.utils.toggleTheme();
                }

            });
        }

    }



}

const app = new App();
