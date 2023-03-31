import axios from "axios"
import AppConfig from "../config/app_config"

export interface User {
    email: string
}

class UsersService {

    async getUser(userEmail: string | undefined | null): Promise<User> {
        console.log("in getUser")
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/users/user/${userEmail}`)
        return response.data
    }

    async getFriends(userEmail: string | undefined | null): Promise<User[]> {
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/users/friends/${userEmail}`)
        return response.data
    }
}

export default UsersService