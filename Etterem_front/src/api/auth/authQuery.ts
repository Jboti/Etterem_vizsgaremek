import axiosClient from "@/lib/axios"
import type { emailVerifyData, LoginData, LoginResponse, RegistrationData,SetPasswordData , ResetPasswordData} from "./auth"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/queryKeys"


const registration = async (data: RegistrationData) => {
    const response = await axiosClient.post("http://localhost:3000/api/v1/register", data)
    return response.data
}

export const useRegistration = () => {
    return useMutation({
        mutationFn: registration,
    })
}

const emailVertification = async (data: emailVerifyData) => {
    const response = await axiosClient.patch("http://localhost:3000/api/v1/verify-user", data)
    return response.data.data
}

export const useEmailVertification = () => {
    const {push} = useRouter()
    return useMutation({
        mutationFn: emailVertification,
        onSuccess() {
            push({name:'Bejelentkezés'})
            
        },
    })
}

const Login = async (data: LoginData) : Promise<LoginResponse> => {
    const response = await axiosClient.post('http://localhost:3000/api/v1/login', data)
    return response.data
}

export const useLogin = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:Login,
        onSuccess(data){
            document.cookie = `token=${data.token}; path=/; SameSite=Strict;`
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
        },
    })
}


const Logout = async () => {
    const response = await axiosClient.post('http://localhost:3000/api/v1/logout', {})
    return response.data
}

export const useLogout = () => {
    const queryClient = useQueryClient()
    const {push} = useRouter()
    return useMutation({
        mutationFn:Logout,
        onSuccess(){
            document.cookie = "token=; path=/;"
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.user] })
            push({name:'Main'})
            window.location.reload()
        },
    })
}


const PasswordReset = async (token: string, data: SetPasswordData) => {
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }
    const response = await axiosClient.post(`http://localhost:3000/api/v1/password-reset/`, data, config) 
    return response.data
}

export const usePasswordReset = () => {
    return useMutation({
        mutationFn:({token,data} : {token:string, data: SetPasswordData }) => PasswordReset(token,data)
    })
}


const PasswordResetEmail = async (data: ResetPasswordData) => {
    const response = await axiosClient.patch('http://localhost:3000/api/v1/password-reset-email', data)
    return response.data
}

export const usePasswordResetEmail = () => {
    return useMutation({
        mutationFn:PasswordResetEmail,
    })
}

const getToken = () =>{
    const cookies = document.cookie.split('; ')
    const tokenCookie = cookies.find(row => row.startsWith('token='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
}

const validateToken = async () =>{
    const token = getToken()
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }
    const response = await axiosClient.post("http://localhost:3000/api/v1/authenticateToken",{} ,config)
    return response.data
}

export const useValidateToken = () =>{
    return useMutation({
        mutationFn:validateToken
    })
}