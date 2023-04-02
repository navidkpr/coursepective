import axios from "axios";
import moment from "moment";
import AppConfig from "../config/app_config";

import { UserProfile } from '@auth0/nextjs-auth0/client';

export interface Review {
    rating: number,
    id: string,
    timePosted: string,
    comments: string,
    user: {
        email: string
    },
    course: {
        courseCode: string,
        name: string
    }
    usefulVoters: []
}

class ReviewService {

    async getCourseReviews(courseId: string, userEmail: string | undefined | null)  {
        console.log("in getCourseReviews")
        console.log(courseId, userEmail)
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

    async getUsersReviews(userEmail: string | undefined | null){
        console.log("in getUsersReviews")
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/reviews/user/${userEmail}`)
        let reviews: Review[] = []
        reviews = response.data
        for(let i = 0; i < reviews.length; i++) {
            reviews[i].timePosted = moment(new Date(reviews[i].timePosted)).fromNow()
        }
        return reviews
    }

    async getUsefulReviews(userEmail: string | undefined | null){
        console.log("in getUsersReviews")
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/reviews/useful/${userEmail}`)
        console.log(response.data)
        let reviews: Review[] = []
        reviews = response.data
        for(let i = 0; i < reviews.length; i++) {
            reviews[i].timePosted = moment(new Date(reviews[i].timePosted)).fromNow()
        }
        return reviews
    }

    async postReview(courseId: string, rating: number, userEmail: string, comments: string): Promise<boolean> {
        console.log("in postReview")
        try {
            const response = await axios.post(`${AppConfig.Backend.BaseUrl}/reviews`, {
                rating,
                courseId,
                userEmail,
                comments
            })
            return true
        } catch (error) {
            console.log(rating, courseId, userEmail, comments)
            console.log(error)
            return false
        }
    }

    async putReviewUseful(rId: string, userEmail: string, action: boolean): Promise<boolean> {
        try {
            const response = await axios.put(`${AppConfig.Backend.BaseUrl}/reviews/${rId}/${userEmail}/toggleUsefulVotes/${action}`)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async checkIfReviewed(courseId: string, userEmail: string | undefined | null){
        // console.log(userEmail)
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/reviews/course/check/${courseId}/${userEmail}`)
        console.log("after checking if reviewed")
        console.log(response.data)
        if(response.data.length == 0){
            return false
        }else{
            return true
        }

    }
}

export default ReviewService