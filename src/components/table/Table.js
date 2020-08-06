import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from '@/components/table/table.template'
import {$} from '@core/dom'
import { resizeHandler } from './table.resize'
import { shouldResize, isCell } from './table.functions'
import { TableSelection } from './TableSelection'
import {range} from '@core/utils'
import {matrix} from '@core/utils'
import { TABLE_RESIZE } from '../../redux/types'
import * as actions from '@/redux/actions'
import {defaultStyles} from '@/constants'
import {parse} from '@core/parse'

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
    return createTable(Table.rowsCount, this.store.getState());
  }

  prepare() {
    this.selection = new TableSelection();
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
    const styles = $cell.getStyles(Object.keys(defaultStyles));
    this.$dispatch(actions.changeStyles(styles))
  }

  init() {
    super.init();
    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell);

    this.$on('formula:input', value => {
      this.selection.current
        .attr('data-value', value)
        .text(parse(value))
      // this.selection.current.text(value)
      this.updateTextInStore(value)
    })

    this.$on('formula:done', () => {
      this.selection.current.focus();
    })

    this.$on('toolbar:applyStyle', value => {
      this.selection.applyStyle(value);
      // this.$dispatch(actions.applyStyle({
      //   value,
      //   ids: this.selection.selectedIds
      // })
      const ids = this.selection.selectedIds;
      this.$dispatch(actions.applyStyle({
        value,
        ids
      }))
    })
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event);
      this.$dispatch(actions.tableResize(data))
    } catch (e) {
      console.warn('Resize error', e.message)
    }
  }

  onMousedown(event) {
    if(shouldResize(event)) {
      this.resizeTable(event)
    } else if(isCell(event)) {
      const $target = $(event.target)
      if(event.shiftKey) {

        const $cells = matrix($target, this.selection.current).map(id => this.$root.find(`[data-id="${id}"]`));
        this.selection.selectGroup($cells)
      } else {
        this.selectCell($target)
      }
    }
  }

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value
    }));
  }

  onInput(event) {
    this.updateTextInStore($(event.target).text())
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