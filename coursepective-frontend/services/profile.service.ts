import axios from "axios"
import AppConfig from "../config/app_config"
import { useUser } from '@auth0/nextjs-auth0/client';

export interface Profile {
    email: string
    name: string
}

class ProfileService {
    async getProfile(profileId: string)  {
        console.log(`${AppConfig.Backend.BaseUrl}/profiles/${profileId}`)
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/profiles/${profileId}`)
        return response.data
    }
}

export default ProfileService