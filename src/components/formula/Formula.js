import {ExcelComponent} from '@core/ExcelComponent'
import {$} from '@core/dom'

export class Formula extends ExcelComponent {
  static className = 'excel__formula'

  constructor($root, options) {
    super($root, {
      name: 'formula',
      listeners: ['input', 'keydown'],
      ...options
    });
  }

  toHTML() {
    return `
    <div class="info">
    fx
</div>
<div class="input" id="formula" contenteditable spellcheck="false">
    
</div>
    `
  }

  init() {
    super.init();

    this.$formula = this.$root.find('#formula');

    this.$on('table:select', $cell => {
      this.$formula.text($cell.text())
    })

    this.$on('table:input', $cell => {
      this.$formula.text($cell.text())
    })
  }

  onInput(event) {
    this.$emit('formula:input', $(event.target).text());
  }

  onKeydown(event) {
    if(event.key === 'Enter') {
      event.preventDefault()
      this.$emit('formula:done');
    }
  }
}
