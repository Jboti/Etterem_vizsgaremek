import axiosClient from "@/lib/axios"
import { useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/queryKeys"
import type { dishData } from "./items"


const getDishes = async (): Promise<dishData[]> => {
    const response = await axiosClient.get("/dishes",{
        headers:{
            "Content-Type": "application/octet-stream",
            maxContentLength: 100000000,
            maxBodyLength: 100000000
        }
    })
    return response.data
}

export const useGetDishes = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.getDishes],
            staleTime:Infinity,
            queryFn: getDishes
        }
    )
}
