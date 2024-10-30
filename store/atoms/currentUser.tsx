import { atom } from 'recoil' 

const currentUserState = atom<User>({
    key: 'current-user-state',
    default: {} as User
}) 

export default currentUserState