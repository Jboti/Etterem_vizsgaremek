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
    options:string | null,
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
    pointsUsed: number,
    city: string | null,
    street: string | null,
    houseNumber: number | null,
    panel: string | null,
    floor: string | null,
    door: string | null,
    doorBell: string | null
}
