import axios from "axios"
import AppConfig from "../config/app_config"

export interface Course {
    name: string
    courseCode: string
    description: string
    id: string
}

class CourseService {
    async getCourse(courseId: string)  {
        console.log(`${AppConfig.Backend.BaseUrl}/courses/${courseId}`)
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/courses/${courseId}`)
        return response.data
    }
}

export default CourseService