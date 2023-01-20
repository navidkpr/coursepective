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
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/courses/${courseId}`)
        return response.data
    }

    async searchForCourses(searchString: string) {
        const response = await axios.post(`${AppConfig.Backend.BaseUrl}/courses/search`, {
            searchString
        })
        console.log(response)
    }
}

export default CourseService