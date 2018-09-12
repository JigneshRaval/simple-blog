export class CommonService {
    categories: any;
    url = process.cwd() + 'posts.json';

    constructor() {
        this.categories = fetch(this.url).then(res => res.json());
    }

    getCategories() {
        return this.categories;
    }

    getTags() {
        return this.categories;
    }
}
