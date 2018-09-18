// utils.ts
// ==============================

// Utility functions

export class Utils {
    scrollDuration: number = 250;

    constructor() { }

    public sgScrollToTop() {
        let scrollStep = -window.scrollY / (this.scrollDuration / 15);

        let scrollInterval = setInterval(function () {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 5);
    }

    /**
     * @function : Scroll to top with smooth animation using javascript only
     * @param event
     */
    public getScrollPosition(elementId: any) {
        let scrollElement = document.getElementById(elementId);

        if (scrollElement) {
            if (window.pageYOffset > 300) {
                scrollElement.classList.add('isVisible');
            } else {
                scrollElement.classList.remove('isVisible');
            }
        }

        if (window.pageYOffset > 150) {
            document.body.classList.add('shrinkHeader');
        } else {
            document.body.classList.remove('shrinkHeader');
        }
    }

    /**
     * @function : Toggle Sidebar Navigation
     * @param event
     */
    public toggleSidebarPanel(event: any) {
        const bodyElem = document.querySelector('body');
        if (bodyElem) {
            if (bodyElem.classList.contains('isIndexNavOpened')) {
                // Left sidebar navigation closed
                bodyElem.classList.remove('isIndexNavOpened');
                // this.updateLocalStorage('isIndexNavOpened', 'false');
            } else {
                bodyElem.classList.add('isIndexNavOpened');
                // this.updateLocalStorage('isIndexNavOpened', 'true');
            }
        }
    }
}
