import axios from "axios"
import moment from "moment"
import AppConfig from "../config/app_config"

export interface Review {
    rating: number,
    id: string,
    timePosted: string,
}

class ReviewService {
    async getCourseReviews(courseId: string)  {
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/reviews/course/${courseId}`)
        const reviews = response.data
        
        for(let i = 0; i < reviews.length; i++) {
            reviews[i].timePosted = moment(new Date(reviews[i].timePosted)).fromNow()
        }
        
        return reviews
    }

    async postReview(courseCode: string, rating: number): Promise<boolean> {
        try {
            const response = await axios.post(`${AppConfig.Backend.BaseUrl}/reviews`, {
                rating,
                courseCode
            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

export default ReviewService