import axios from "axios"
import AppConfig from "../config/app_config"

export interface Course {
    name: string
    courseCode: string
    description: string
    id: string
}

class CourseService {
    async getCourse(courseCode: string)  {
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/courses/${courseCode}`)
        return response.data
    }

    async searchForCourses(searchString: string): Promise<Course[]> {
        const response = await axios.post(`${AppConfig.Backend.BaseUrl}/courses/search`, {
            searchString
        })
        return response.data.courses
    }
}

export default CourseService