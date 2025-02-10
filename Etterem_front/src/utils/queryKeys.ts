const USER_KEYS = {
    user: 'user',
    validToken: 'validToken',
}

const DISH_KEYS = {
    getDishes: 'getDishes',

}


export const QUERY_KEYS = {
    ...USER_KEYS,
    ...DISH_KEYS,
} as const