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

export type cartItem = {
    cartId:number,
    dishId:number,
    name:string,
    price:number
    sause:string,
    options:string,
    type:string
}