import { atom } from 'recoil' 

const isFull = atom({
    key: 'is-full-state',
    default: true
}) 

export default isFull