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
    async sendFriendRequest() {

    }

    async getFriendRequests() {
    
    }

    async respondToFriendRequest() {

    }
}

export default FriendService