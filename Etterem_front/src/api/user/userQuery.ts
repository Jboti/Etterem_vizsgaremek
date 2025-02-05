import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/queryKeys"
import type { ChangeUserName } from "../auth/auth"
import { useRouter } from "vue-router"


const getToken = () =>{
    const cookies = document.cookie.split('; ')
    const tokenCookie = cookies.find(row => row.startsWith('token='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
}

const getUserInfo = async () => {
    const token = getToken()
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }
    const response = await axiosClient.get("http://localhost:3000/api/v1/get-user", config)
    return response.data
}

export const useGetUserInfo = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.user],
            queryFn: getUserInfo,
            staleTime: 1000 * 60 * 10,
            retry: 0
        }
    )
    
}


const UserNameChange = async (data: ChangeUserName) => {
    const token = getToken()
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }
    const response = await axiosClient.patch('http://localhost:3000/api/v1/user-name-change', data, config )
    return response.data
}

export const useUserNameChange = () => {
    const {push} = useRouter()
    return useMutation({
        mutationFn:UserNameChange,
        onSuccess(){
            push({name:'Főoldal'})
            setTimeout(() => {
                location.reload()
            }, 10)
        }
    })
}
