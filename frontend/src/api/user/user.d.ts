export type allergies = {
    gluten: boolean,
    lactose: boolean,
    egg: boolean,
    nuts: boolean
}

export type DeleteUserData = {
    email: string,
    password: string
}

export type addressData = {
    city: string,
    street: string,
    houseNumber: number,
    panel: number | null,
    floor: number | null,
    door: number | null,
    doorBell: number | null
}