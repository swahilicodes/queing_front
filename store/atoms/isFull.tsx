import { atom } from 'recoil' 

const isFull = atom({
    key: 'is-full-state',
    default: false
}) 

export default isFull