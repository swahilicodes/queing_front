interface Token{
    token: {
        id: number,
        status: string,
        stage: string,
        dateTime: Date,
        phone: string,
        ticket_no: number,
        mr_no: string,
        disability: string,
        disabled: boolean,
        createdAt: Date,
        updatedAt: Date
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