import {capitalize} from '@core/utils'

export class DomListener {
  constructor($root, listeners = []) {
    if (!$root) {
      throw new Error('Not $root provided for DOMListener')
    }
    this.$root = $root;
    this.listeners = listeners;
  }

  initDOMListeners() {
    this.listeners.forEach(listener => {
      const method = getMethodName(listener);
      if(this[method]) {
        this[method] = this[method].bind(this);
        this.$root.on(listener, this[method])
      } else {
        console.warn(`${method} in ${this.name || ''} isn't realized!!!`);
      }
    })
  }

  removeDOMListeners() {
    this.listeners.forEach(listener => {
      const method = getMethodName(listener);
      this.$root.off(listener, this[method]);
    })
  }
}

function getMethodName(eventName) {
  return 'on' + capitalize(eventName);
}
