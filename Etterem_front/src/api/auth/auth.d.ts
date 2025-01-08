export type RegistrationData = {
    name: string,
    email: string,
    neptun_code: string
}

export type RegistrationResponse = {
    token: string
}

export type SetPasswordResponse = {
    status: string,
    data: []
}

export type SetPasswordData = {
    password: string,
    password_confirmation: string,
}


export type LoginData = {
    email:string,
    password:string
}
export type LoginResponse = {
    token:string
}

export type ResetPasswordData = {
    email:string
}