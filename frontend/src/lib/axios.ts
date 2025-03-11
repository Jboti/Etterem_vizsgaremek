import axios from "axios"

const getToken = () => {
  const cookies = document.cookie.split("; ")
  const tokenCookie = cookies.find(row => row.startsWith("token="))
  return tokenCookie ? tokenCookie.split("=")[1] : null
}

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
})

axiosClient.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosClient