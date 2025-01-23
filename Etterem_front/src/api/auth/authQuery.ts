import axiosClient from "@/lib/axios"
import type { emailVerifyData, LoginData, LoginResponse, RegistrationData, } from "./auth"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/queryKeys"


const registration = async (data: RegistrationData) => {
    const response = await axiosClient.post("http://localhost:3000/api/v1/register", data)
    return response.data
}

export const useRegistration = () => {
    const { push } = useRouter()
    
    return useMutation({
        mutationFn: registration,
        onSuccess() {
            push({ name: 'email-sent' })
        },
       
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
            push({name:'Főoldal'})
            
        },
    })
}

const Login = async (data: LoginData) : Promise<LoginResponse> => {
    const response = await axiosClient.post('http://localhost:3000/api/v1/login', data)
    console.log(response.data.token)
    return response.data
}

export const useLogin = () => {
    const {push} = useRouter()
    return useMutation({
        mutationFn:Login,
        onSuccess(data){
            console.log("success")
            document.cookie = `token=${data.token}; path=/; SameSite=Strict;`
            console.log(document.cookie)
            push({name:'Főoldal'})
        }
    })
}
