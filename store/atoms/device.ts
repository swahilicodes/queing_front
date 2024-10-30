import { atom } from 'recoil' 

const deviceState = atom<Device>({
    key: 'device-state',
    default: {} as Device
}) 

export default deviceState