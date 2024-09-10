import { atom } from 'recoil' 

const currentConditionState = atom({
    key: 'current-condition-state',
    default: "normal"
}) 

export default currentConditionState