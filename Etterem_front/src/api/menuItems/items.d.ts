export type dishData = {
    id: number,
    name: string,
    created: Date,
    price: number,
    available: boolean,
    sauceOptions: sauseOptions,
    customizationOptions: CustomizationOptions,
    description: string,
    type: string,
    img: Blob,
    filter?: any;
}

export type sauseOptions = {
    name: string
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
    sause:string | null,
    options:string,
    type:string,
    quantity: number
}

export type placeOrderData = {
    totalPrice: number,
    message: string,
    takeAway: boolean,
    dishIds:number[],
    dishAmounts:number[],
    dishCustomizations:string[],
    pointsUsed: number
}
