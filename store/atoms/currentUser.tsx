import { atom } from 'recoil' 

const currentUserState = atom({
    key: 'current-user-state',
    default: {}
}) 

export default currentUserState