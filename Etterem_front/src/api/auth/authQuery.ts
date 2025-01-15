import axiosClient from "@/lib/axios"
import type { LoginData, LoginResponse, RegistrationData, RegistrationResponse, ResetPasswordData, SetPasswordData, SetPasswordResponse } from "./auth"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/queryKeys"

// const registration = async (data: RegistrationData): Promise<RegistrationResponse> => {
//     const response = await axiosClient.post("localhost:3000/createUser", data)
//     console.log({response})
//     return response.data.data
// }

// export const useRegistration = () => {
//     const {push} = useRouter()
//     return useMutation({
//         mutationFn: registration,
//         onSuccess(data) {
//             push({name: 'set-password', params: {token: data.token}})
//         },
//     })
// }
const registration = async (data: RegistrationData): Promise<RegistrationResponse> => {
    const response = await axiosClient.post("http://localhost:3000/user/createUser", data)
    console.log(response)
    return response.data.data
}
export const useRegistration = () => {
    const {push} = useRouter()
    return useMutation({
        mutationFn: registration,
        onSuccess(data) {
            push({name: 'Főoldal'})
            console.log(data.token)
        },
    })
}


const getSetPassword = async (): Promise<SetPasswordResponse> => {
    const {params} = useRoute()
    const response = await axiosClient.get(`http://172.22.1.219/api/v1/set-password/${params.token}`)
    return response.data
}

export const useGetSetPassword = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.setPassword],  //setPassword
            queryFn: getSetPassword,
        }
    )
}

const putSetPassword = async (token: string, data: SetPasswordData) => {
    const response = await axiosClient.put(`http://172.22.1.219/api/v1/set-password/${token}`, data)
    return response.data
}

export const usePutSetPassword = () => {
    const {push} = useRouter()
    return useMutation(
        {
            mutationFn: ({token, data} : { token: string, data: SetPasswordData }) => putSetPassword(token, data),
            onSuccess() {
                push({name:'login'})
            },
        }
    )
}


const Login = async (data: LoginData) : Promise<LoginResponse> => {
    const response = await axiosClient.post('http://172.22.1.219/api/v1/login', data)
    return response.data.data
}

export const useLogin = () => {
    const {push} = useRouter()
    return useMutation({
        mutationFn:Login,
        onSuccess(data){
            localStorage.token = data.token
            push({name:'projects'})
        }
    })
}


const postPasswordReset = async ( data: ResetPasswordData) => {
    const response = await axiosClient.post(`http://172.22.1.219/api/v1/password-reset`, data)
    return response.data.data
}

export const usePostPasswordReset = () => {
    const {push} = useRouter()
    return useMutation(
        {
            mutationFn: postPasswordReset,
            onSuccess(data) {
                push({name: 'password-reset', params: {token: data.token}})
            },
        }
    )
}


const getPasswordReset = async () : Promise<SetPasswordResponse> => {
    const {params} = useRoute()
    const response = await axiosClient.get(`http://172.22.1.219/api/v1/password-reset/${params.token}`)
    return response.data
}

export const useGetPasswordReset = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.passwordReset],
            queryFn: getPasswordReset,
        }
    )
}


const putPasswordReset = async (token: string, data: SetPasswordData) => {
    const response = await axiosClient.put(`http://172.22.1.219/api/v1/password-reset/${token}`, data)
    return response.data
}

export const usePutPasswordReset = () => {
    const {push} = useRouter()
    return useMutation(
        {
            mutationFn: ({token, data} : { token: string, data: SetPasswordData }) => putPasswordReset(token, data),
            onSuccess() {
                push({name:'login'})
            },
        }
    )
}