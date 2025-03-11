import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/queryKeys"
import type { ChangeUserName } from "../auth/auth"
import { useRouter } from "vue-router"
import type { placeOrderData } from "../menuItems/items"
import queryClient from "@/lib/queryClient"
import type { allergies, DeleteUserData } from "./user"


const getUserInfo = async () => {
    const response = await axiosClient.get("/user")
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
    const response = await axiosClient.get("/user-orders")
    return response.data
}

export const useGetAllPurchaseUserInfo = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.userPurchases],
        queryFn: getAllPurchaseUserInfo, 
        staleTime: 3600 * 1000,  
        retry: 1                 
    })
}


const UserNameChange = async (data: ChangeUserName) => {
    const response = await axiosClient.patch('/username', data )
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
    const response = await axiosClient.post("/order",data)
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
    const response = await axiosClient.patch("/allergies", data)
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
    await axiosClient.post("/user-password-validate",data)
}
    
export const useDeleteUserPwConfirm = () => {
    return useMutation({
        mutationFn:deleteUserPwConfirm,
    })
}


const deleteUser = async () =>
{
    await axiosClient.delete("/user")
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