import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from '@/components/table/table.template'
import {$} from '@core/dom'
import { resizeHandler } from './table.resize'
import { shouldResize, isCell } from './table.functions'
import { TableSelection } from './TableSelection'
import {range} from '@core/utils'
import {matrix} from '@core/utils'

export class Table extends ExcelComponent {
  static className = 'excel__table';
  static rowsCount = 15;

  constructor($root, options) {
    super($root, {
      listeners: ['mousedown', 'keydown', 'input'],
      name: 'Table',
      ...options
    })
  }

  toHTML() {
    return createTable(Table.rowsCount);
  }

  prepare() {
    this.selection = new TableSelection();
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell)
  }

  init() {
    super.init();
    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell);
    this.$on('formula:input', text => {
      this.selection.current.text(text)
    })
    this.$on('formula:done', () => {
      this.selection.current.focus();
    })
  }

  onMousedown(event) {
    if(shouldResize(event)) {
      resizeHandler(this.$root, event);
    } else if(isCell(event)) {
      const $target = $(event.target)
      if(event.shiftKey) {

        const $cells = matrix($target, this.selection.current).map(id => this.$root.find(`[data-id="${id}"]`));
        this.selection.selectGroup($cells)
      } else {
        this.selection.select($target);
      }
    }
  }

  onInput(event) {
    this.$emit('table:input', $(event.target))
  }

  onKeydown(event) {
    const keys = ['Enter', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    const {key} = event;

    if(keys.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const {col, row} = this.selection.current.id(true);
      const $next = this.$root.find(nextSelector(key, col, row));

      this.selectCell($next)
    }
  }
}

function nextSelector(key, col, row) {
  const MIN_VALUE = 0;
  const MAX_BOTTOM = Table.rowsCount;
  const MAX_RIGHT = 26;
  switch (key) {
    case 'Enter':
    case 'ArrowDown':
      row = row + 1 == MAX_BOTTOM ? MAX_BOTTOM - 1 : row + 1;
      break
    case 'Tab':
    case 'ArrowRight':
      col = col + 1 == MAX_RIGHT ? MAX_RIGHT - 1 : col + 1;
      break;
    case 'ArrowLeft':
      col = col - 1 < MIN_VALUE ? MIN_VALUE : col - 1;
      break;
    case 'ArrowUp':
      row = row - 1 < MIN_VALUE ? MIN_VALUE : row - 1;
      break;
  }

  return `[data-id="${row}:${col}"]`
}