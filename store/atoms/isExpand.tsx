import { atom } from 'recoil' 

const isExpandState = atom({
    key: 'is-expand-state',
    default: false
}) 

export default isExpandState