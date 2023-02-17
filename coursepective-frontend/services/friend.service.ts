import axios from "axios"
import AppConfig from "../config/app_config"

export interface FriendRequest {
    id: string
    origin: {
        id: string
        email: string
    }
    dest: {
        id: string
        email: string
    }
}

class FriendService {
    async sendFriendRequest(userEmail: string, targetEmail: string): Promise<boolean> {
        console.log("sending friend request")
        const response = await axios.post(`${AppConfig.Backend.BaseUrl}/friends/requests`, { originEmail: userEmail, destEmail: targetEmail })
        return response.data.friendRequests 
    }

    async getFriendRequests(userEmail: string): Promise<FriendRequest[]> {
        const response = await axios.post(`${AppConfig.Backend.BaseUrl}/friends/requests/get`, { userEmail })
        return response.data.friendRequests
    }

    async respondToFriendRequest() {

    }
}

export default FriendService