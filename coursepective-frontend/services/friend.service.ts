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
    async sendFriendRequest(userEmail: string, targetEmail: string) {
        await axios.post(`${AppConfig.Backend.BaseUrl}/friends/requests`, { originEmail: userEmail, destEmail: targetEmail })
    }

    async getFriendRequests(userEmail: string): Promise<FriendRequest[]> {
        const response = await axios.post(`${AppConfig.Backend.BaseUrl}/friends/requests/get`, { userEmail })
        return response.data.friendRequests
    }

    async respondToFriendRequest(userEmail: string, friendRequestId: string, accepted: boolean) {
        await axios.post(`${AppConfig.Backend.BaseUrl}/friends/requests/response`, { userEmail, accept: accepted, friendRequestId })
    }
}

export default FriendService