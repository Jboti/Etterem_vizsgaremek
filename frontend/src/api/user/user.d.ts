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
    panel: string | null,
    floor: string | null,
    door: string | null,
    doorBell: string | null
}