import axiosClient from "@/lib/axios"
import type { emailVerifyData, LoginData, LoginResponse, RegistrationData,SetPasswordData , ResetPasswordData} from "./auth"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/queryKeys"


const registration = async (data: RegistrationData) => {
    const response = await axiosClient.post("/register", data)
    return response.data
}

export const useRegistration = () => {
    return useMutation({
        mutationFn: registration,
    })
}


const emailVertification = async (data: emailVerifyData) => {
    const response = await axiosClient.patch("/verify-user", data)
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
    const response = await axiosClient.post("/login", data)
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
    const response = await axiosClient.post("/logout", {})
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
    const response = await axiosClient.post("/password-reset", data, { headers: { Authorization: `Bearer ${token}` } })
    return response.data
}

export const usePasswordReset = () => {
    return useMutation({
        mutationFn:({token,data} : {token:string, data: SetPasswordData }) => PasswordReset(token,data)
    })
}


const PasswordResetEmail = async (data: ResetPasswordData) => {
    const response = await axiosClient.patch("/password-reset-email", data)
    return response.data
}

export const usePasswordResetEmail = () => {
    return useMutation({
        mutationFn:PasswordResetEmail,
    })
}


const validateToken = async () => {
    const response = await axiosClient.post("/authenticate-token")
    return response.data
}

export const useValidateToken = () => {
    return useMutation({
        mutationFn:validateToken
    })
}