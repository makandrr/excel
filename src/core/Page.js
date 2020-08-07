export class Page {
    constructor(params) {
        this.params = params;
    }

    getRoot() {
        throw new Error('Where is the getRoot?')
    }

    afterRender() {

    }

    destroy() {

    }
}