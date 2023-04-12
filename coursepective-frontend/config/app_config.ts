import { loadEnvConfig } from '@next/env'

const AppConfig = {
    Backend: {
        BaseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    }
}

export default AppConfig