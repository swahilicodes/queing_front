interface User {
    id: number,
    name: string,
    phone: string,
    service: string,
    clinic: string,
    clinic_code: number,
    room: string,
    counter: string,
    role: string,
    display_photo: string,
    password: string,
    current_patient: string,
    createdAt: Date,
    updatedAt: Date,
    clinics: []
}