import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/queryKeys"
import type { ChangeUserName } from "../auth/auth"
import { useRouter } from "vue-router"
import type { placeOrderData } from "../menuItems/items"
import queryClient from "@/lib/queryClient"
import type { allergies, DeleteUserData } from "./user"
import type { AxiosResponse } from "axios"


const getToken = () =>{
    const cookies = document.cookie.split('; ')
    const tokenCookie = cookies.find(row => row.startsWith('token='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
}

const getUserInfo = async () => {
    try {
        const token = getToken()
        if (!token) return null
        
        let config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        
        const response = await axiosClient.get("http://localhost:3000/api/v1/get-user", config)
        return response.data
    } catch (error) {
        console.error("Hiba történt a getUserInfo hívás során: ", error)
        return null
    }
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
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userPurchases] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
        }
    })
}

const updateAllergies = async ( data:allergies ) => {
    const token = getToken()
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }
    const response = await axiosClient.patch("http://localhost:3000/api/v1/update-allergies", data, config)
    return response.data
}

export const useUpdateAllergies = () => {
    return useMutation({
        mutationFn:updateAllergies,
        onSuccess(){
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
        },
        onError(err){
            console.log(err)
        }
    })
}

const deleteUserPwConfirm = async (data: DeleteUserData) =>
{
    const token = getToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    const response = axiosClient.post("http://localhost:3000/api/v1/delete-user-password-check",data, config)
    return response
}
    
export const useDeleteUserPwConfirm = () => {
    return useMutation({
        mutationFn:deleteUserPwConfirm,
    })
}

const deleteUser = async () : Promise<AxiosResponse> =>
{
    const token = getToken()
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }
    const response = axiosClient.delete("http://localhost:3000/api/v1/delete-user", config)
    return response
}

export const useDeleteUser = () => {
    return useMutation({
        mutationFn:deleteUser,
        onSuccess(){
            document.cookie = "token=; path=/;"
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userPurchases] })
        },
        onError(err){
            console.log(err)
        }
    })
}
