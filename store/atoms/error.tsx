import { atom } from 'recoil' 

const errorState = atom({
    key: 'error-state',
    default: ""
}) 

export default errorState