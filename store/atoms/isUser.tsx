import { atom } from 'recoil' 

const isUserState = atom({
    key: 'is-user-state',
    default: false
}) 

export default isUserState