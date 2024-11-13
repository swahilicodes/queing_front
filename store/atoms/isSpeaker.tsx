import { atom } from 'recoil' 

const isSpeakerState = atom({
    key: 'is-speaker-state',
    default: false
}) 

export default isSpeakerState