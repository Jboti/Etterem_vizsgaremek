import axiosClient from "@/lib/axios"
import { useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/queryKeys"

const getUserInfo = async () => {
    const response = await axiosClient.get("http://localhost:3000/api/v1/get-user", {withCredentials: true})
    return response.data
}

export const useGetUserInfo = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.user],
            queryFn: getUserInfo,
        }
    )
    
}