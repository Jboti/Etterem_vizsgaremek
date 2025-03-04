import axiosClient from "@/lib/axios"
import { useQuery } from "@tanstack/vue-query"
import { QUERY_KEYS } from "@/utils/queryKeys"
import type { dishData } from "./items"

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    // Itt módosítsd az image típusát (pl. image/png), ha szükséges
    return `data:image/png;base64,${window.btoa(binary)}`
  }

const getDishes = async (): Promise<dishData> => {
    const response = await axiosClient.get("/dishes")
    return response.data.map((dish: any) => ({
        ...dish,
        img: arrayBufferToBase64(dish.img.data)
      }))
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
