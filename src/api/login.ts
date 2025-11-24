import { post } from "@/utils/http"
import type { LoginType } from "@/type/login"

const API = {
    Login:'/login'
}

const getLoginAPI = (data:LoginType):Promise<any> => {
    return post(API.Login, data)
}
export { getLoginAPI }