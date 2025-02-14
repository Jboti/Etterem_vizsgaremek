import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/queryKeys"
import type { ChangeUserName } from "../auth/auth"
import { useRouter } from "vue-router"
import type { placeOrderData } from "../menuItems/items"
import queryClient from "@/lib/queryClient"


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
            staleTime: Infinity,
            retry: 0
        }
    )
    
}

const getAllPurchaseUserInfo = async () =>{
    const token = getToken()
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }
    const response = await axiosClient.get("http://localhost:3000/api/v1/get-all-order-user-only", config)
    return response.data;
}

export const useGetAllPurchaseUserInfo = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.userPurchases],
        queryFn: getAllPurchaseUserInfo, 
        staleTime: 3600 * 1000,  
        retry: 1                 
    });
};

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
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.user] })
            push({name:'Main'})
            setTimeout(() => {
                location.reload()
            }, 10)
        }
    })
}

const PlaceOrder = async (data:placeOrderData) => {
    const token = getToken()
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }
    const response = await axiosClient.post("http://localhost:3000/api/v1/place-order",data, config)
    return response.data.data
}



export const usePlaceOrder = () => {
    return useMutation({
        mutationFn:PlaceOrder,
        onSuccess(){
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.userPurchases] })
        }
    })
}