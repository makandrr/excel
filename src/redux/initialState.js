import {storage, clone} from '@core/utils'
import {defaultStyles, defaultTitle} from '@/constants'

const defaultState = {
    rowState: {},
    colState: {},
    dataState: {},
    stylesState: {},
    currentText: '',
    currentStyles: defaultStyles,
    title: defaultTitle,
    openedDate: new Date().toJSON()
}

const normalize = state => ({
    ...state,
    currentStyles: defaultStyles,
    currentText: ''
})

// export const initialState = storage('excel-state') ? normalize(storage('excel-state')) : defaultState;

export const normalizeInitialState = state => {
    return state ? normalize(state) : clone(defaultState);
}