import { Table } from "./Table";

export class TableSelection {
    static className = 'selected';

    constructor() {
        this.group = [];
        this.current = null;
    }

    select($el) {
        this.clear();
        this.group.push($el)
        this.current = $el;
        $el.focus().addClass('selected')
    }

    clear() {
        this.group.forEach($el => $el.removeClass(TableSelection.className))
        this.group = [];
    }

    selectGroup($group = []) {
        this.clear();
        this.group = $group;
        this.group.forEach($el => $el.addClass(TableSelection.className))
    }

    applyStyle(style) {
        this.group.forEach($el => $el.css(style))
    }

    get selectedIds() {
        return this.group.map($el => $el.id())
    }
}