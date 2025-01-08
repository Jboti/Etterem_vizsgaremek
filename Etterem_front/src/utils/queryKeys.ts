const USER_KEYS = {
    users: 'users',
    user: 'user'
}

const AUTH_KEYS = {
    setPassword: 'setPassword',
    passwordReset:'passwordReset'
}

const PROJECT_KEYS = {
    getProjects:'getProjects',
    getProject:'getProject'
}


export const QUERY_KEYS = {
    ...USER_KEYS,
    ...AUTH_KEYS,
    ...PROJECT_KEYS,
} as const