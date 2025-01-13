export type dishData = {
    id: number,
    name: string,
    created: Date,
    price: number,
    available: boolean,
    customizationOptions: CustomizationOptions,
    description: string,
    type: string
}

export type customizationOptions = {
    name: string,
    price: number
}