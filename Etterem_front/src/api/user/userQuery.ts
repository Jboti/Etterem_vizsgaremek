import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/queryKeys"
import type { ChangeUserName } from "../auth/auth"
import { useRouter } from "vue-router"
import type { placeOrderData } from "../menuItems/items"


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
            staleTime: 3600 * 1000,
            retry: 0
        }
    )
    
}

const getAllPurchaseUserInfo = async() =>{
    const response = await axiosClient.get("http://localhost:3000/api/v1/get-all-order-user-only")
    return response.data;
}

export const useGetAllPurchaseUserInfo = () => {
    return useQuery({
        queryKey: ["allPurchaseUserInfo"], // Cache-kulcs
        queryFn: getAllPurchaseUserInfo,   // Függvény, ami lekéri az adatokat
        staleTime: 3600 * 1000,  // 1 órán keresztül frissnek tekinti az adatokat
        retry: 1                 // Egy sikertelen próbálkozás után nem próbálkozik újra
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
            push({name:'Főoldal'})
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
    return response.data
}



export const usePlaceOrder = () => {
    return useMutation({
        mutationFn:PlaceOrder,
    })
}