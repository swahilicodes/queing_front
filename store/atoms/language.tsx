import { atom } from 'recoil' 

const LanguageState = atom({
    key: 'language-state',
    default: "English"
}) 

export default LanguageState