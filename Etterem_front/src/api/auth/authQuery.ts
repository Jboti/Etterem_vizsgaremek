import axiosClient from "@/lib/axios"
import type { emailVerifyData, LoginData, LoginResponse, RegistrationData,SetPasswordData } from "./auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
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
    const {push} = useRouter()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:Login,
        onSuccess(data){
            document.cookie = `token=${data.token}; path=/; SameSite=Strict;`
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
            push({name:'Főoldal'})
        },
    })
}


// const Logout = async (data: LoginData) => {
//     const response = await axiosClient.post('http://localhost:3000/api/v1/login', data)
//     return response.data
// }

// export const useLogout = () => {
//     const {push} = useRouter()
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationFn:Logout,
//         onSuccess(){
//             document.cookie = "token=; path=/;";
//             queryClient.removeQueries({ queryKey: [QUERY_KEYS.user] });
//             push({name:'Főoldal'})
//         },
//     })
// }


const PasswordReset = async (data: SetPasswordData) => {
    const response = await axiosClient.patch('http://localhost:3000/api/v1/password-reset', data)
    console.log(response.data.token)
    return response.data
}

export const usePasswordReset = () => {
    const {push} = useRouter()
    return useMutation({
        mutationFn:PasswordReset,
        onSuccess(data){
            document.cookie = `token=${data.token}; path=/; SameSite=Strict;`
            console.log(document.cookie)
            push({name:'Főoldal'})
        },
    })
}

