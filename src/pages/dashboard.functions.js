import { storage } from "../core/utils";

export function toHTML(key) {
    const model = storage(key);
    const id = key.split(':')[1]
    return `
    <li class="db__record">
        <a href="#excel/${id}">${model.title}</a>
        <strong>${'<big>' + new Date(model.openedDate).toLocaleDateString() + '</big> / ' + new Date(model.openedDate).toLocaleTimeString()}</strong>
    </li>
    `
}
//excel:42387584584323
function getAllKeys() {
    const keys = [];
    for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if(!key.includes('excel')) {
            continue
        }
        keys.push(key)
    }
    return keys;
}

export function createRecords() {
    
    const keys = getAllKeys()
    if(!keys.length) {
        return `<big>Нет таблиц</big>`
    }
    
    return `
        <div class="db__list-header">
            <span>Название</span>
            <span>Дата открытия</span>
        </div>

        <ul class="db__list">
            ${keys.map(toHTML).join('')}
        </ul>
    `
}

