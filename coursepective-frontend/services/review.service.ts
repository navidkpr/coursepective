import axios from "axios";
import moment from "moment";
import AppConfig from "../config/app_config";

import { UserProfile } from '@auth0/nextjs-auth0/client';

export interface Review {
    rating: number,
    id: string,
    timePosted: string,
    user: {
        email: string
    }
}

class ReviewService {

    async getCourseReviews(courseId: string, userEmail: string | undefined | null)  {
        let reviews: Review[] = []
        if (userEmail) {
            const response = await axios.get(`${AppConfig.Backend.BaseUrl}/reviews/course/${courseId}/${userEmail}`)
            reviews = response.data
        } else {
            const response = await axios.get(`${AppConfig.Backend.BaseUrl}/reviews/course/${courseId}`)
            reviews = response.data
        }
        
        for(let i = 0; i < reviews.length; i++) {
            reviews[i].timePosted = moment(new Date(reviews[i].timePosted)).fromNow()
        }
        
        return reviews
    }

    async postReview(courseId: string, rating: number, userEmail: string): Promise<boolean> {
        try {
            const response = await axios.post(`${AppConfig.Backend.BaseUrl}/reviews`, {
                rating,
                courseId,
                userEmail
            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

export default ReviewService