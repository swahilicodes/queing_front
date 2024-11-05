interface Token{
    token: {
        id: number,
        status: string,
        stage: string,
        dateTime: Date,
        clinic_code: string,
        phone: string,
        gender: string,
        ticket_no: number,
        mr_no: string,
        disability: string,
        disabled: boolean,
        createdAt: Date,
        med_time: Date,
        account_time: Date,
        updatedAt: Date,
        serving: boolean
    },
    counter: {
        id: number,
        service: string,
        namba: string,
        subservice: string,
        createdAt: Date,
        updatedAt: Date
    }
}