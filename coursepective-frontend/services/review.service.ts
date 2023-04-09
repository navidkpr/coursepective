import axios from "axios";
import moment from "moment";
import AppConfig from "../config/app_config";

import { UserProfile } from '@auth0/nextjs-auth0/client';
import { test } from "node:test";

export interface Review {
    teachingRating: number,
    labRating: number,
    testRating: number,
    id: string,
    timePosted: string,
    comments: string,
    user: {
        email: string,
        profilePictureUrl: string,
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

    async postReview(courseId: string, teachingRating: number, labRating: number, testRating: number, userEmail: string, comments: string): Promise<boolean> {
        console.log("in postReview")
        try {
            const response = await axios.post(`${AppConfig.Backend.BaseUrl}/reviews`, {
                teachingRating,
                labRating,
                testRating,
                courseId,
                userEmail,
                comments
            })
            return true
        } catch (error) {
            console.log(teachingRating, labRating, testRating, courseId, userEmail, comments)
            console.log(error)
            return false
        }
    }

    async editReview(courseId: string, teachingRating: number, labRating: number, testRating: number, userEmail: string, comments: string): Promise<boolean> {
        console.log("in editReview")
        try {
            const response = await axios.patch(`${AppConfig.Backend.BaseUrl}/reviews`, {
                teachingRating,
                labRating,
                testRating,
                courseId,
                userEmail,
                comments
            })
            return true
        } catch (error) {
            console.log(teachingRating, labRating, testRating, courseId, userEmail, comments)
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

    async getUserCourseReview(courseId: string, userEmail: string | undefined | null){
        // console.log(userEmail)
        const response = await axios.get(`${AppConfig.Backend.BaseUrl}/reviews/course/check/${courseId}/${userEmail}`)
        console.log("after checking if reviewed")
        console.log(response.data)
        if(response.data.length == 0){
            return false
        }else{
            return response.data
        }

    }
}

export default ReviewService