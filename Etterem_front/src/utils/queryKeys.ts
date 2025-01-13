const USER_KEYS = {
    users: 'users',
    user: 'user'
}

const AUTH_KEYS = {
    setPassword: 'setPassword',
    passwordReset:'passwordReset'
}

const DISH_KEYS = {
    getDishes: 'getDishes',

}


export const QUERY_KEYS = {
    ...USER_KEYS,
    ...AUTH_KEYS,
    ...DISH_KEYS,
} as const