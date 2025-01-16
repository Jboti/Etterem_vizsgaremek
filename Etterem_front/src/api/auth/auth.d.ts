export type RegistrationData = {
    userName: string,
    fullName: string
    email: string,
    password: string
}

export type emailVertifyData = {
    token:string,
    uid: number
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