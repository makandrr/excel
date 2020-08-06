export function capitalize(string) {
    if(typeof string != 'string') {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function range(start, end) {
    if(start > end) {
      [start, end] = [end, start]
    }
    return new Array(end - start + 1)
      .fill('')
      .map((_, index) => start + index)
}

export function matrix($target, $current) {
    const target = $target.id(true);
    const current = $current.id(true)
    const cols = range(current.col, target.col);
    const rows = range(current.row, target.row);
        
    return cols.reduce((acc, col) => {
      rows.forEach(row => acc.push(`${row}:${col}`));
      return acc;
    }, [])
}

export function storage(key, data = null) {
  if(!data) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return localStorage.getItem(key)
    }
  } else {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function isEqual(a, b) {
  if(typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return a === b;
}

export function camelToDash(str){
  return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
}

export function toInlineStyles(styles = {}) {
  return Object.keys(styles)
            .map(key => `${camelToDash(key)}: ${styles[key]}`)
            .join(';')
}

export function debounce(fn, wait) {
  let timeout
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}


// {"rowState":{"3":92},"colState":{"1":235,"2":132,"3":181},"dataState":{"4:5":"gfdfg","7:4":"fdfg","6:6":"fdsdfdsfd","0:0":"FIRST","2:1":"GFDSGDFJHGHGHJdfgdf","5:4":"ds","5:7":"gdfgdf","4:10":"gdfgdfgdf","11:11":"gfdgfd","6:13":"gdfgfdgdf","3:13":"gdfgd","9:3":"fdskjhj","0:1":"gfdgdf","2:2":"gdfgd","3:2":"FDSDFFDHG","4:1":"","3:1":"","1:1":"GDFGD"},"currentText":"GDFGD"}