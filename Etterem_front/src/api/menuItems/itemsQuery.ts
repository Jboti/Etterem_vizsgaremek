import axiosClient from "@/lib/axios"
import { useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/queryKeys"
import type { dishData } from "./items"

const getDishes = async (): Promise<dishData> => {
    const response = await axiosClient.get("http://localhost:3000/dish/getAllDishes")
    console.log({response})
    return response.data
}

export const useGetDishes = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.getDishes],
            queryFn: getDishes
        }
    )
}
