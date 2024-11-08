import { atom } from 'recoil' 

const messageState = atom({
    key: 'message-state',
    default: {
        title: "",
        category: ""
    }
}) 

export default messageState