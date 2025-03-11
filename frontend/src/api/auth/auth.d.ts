export type RegistrationData = {
    userName: string,
    fullName: string
    email: string,
    password: string,
    passwordRe: string
}

export type emailVerifyData = {
    token:string,
}

export type LoginData = {
    email:string,
    password:string
}

export type LoginResponse = {
    token:string
}

export type SetPasswordResponse = {
    status: string,
    data: []
}

export type SetPasswordData = {
    password: string,
    password_confirmation: string
}

export type ResetPasswordData = {
    email:string
}

export type ChangeUserName ={
    userName: string,
    password: string
}