import moment from "moment";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import CourseService, { Course } from "../services/course.service";
import ReviewService, { Review } from "../services/review.service";

import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';
import reviewService from "../services/review.service";

export default function CoursePage(props: { course: Course}) {

    const { user } = useUser();

    const course = props.course
    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState(1)
    const [comments, setComments] = useState("")
    const [reviewsInitialized, setReviewsInitialized] = useState(false)


    async function updateReviews() {
        console.log("in updateReviews")
        const reviewService = new ReviewService()
        const userEmail = user? user.email : undefined
        const fetchedReviews: Review[] = await reviewService.getCourseReviews(course.id, userEmail)
        setReviews(fetchedReviews)
        setReviewsInitialized(true)
    }

    useEffect(() => {
        updateReviews()
    }, [user])
    
    // updateReviews()

    async function PostReview() {
        console.log("in PostReview")
        if (!user) {
            return
        }
        const reviewService = new ReviewService()
        await reviewService.postReview(course.id, rating, user.email, comments)
        updateReviews()
    }

    return (
        <>
        <div className="flex justify-center flex-col items-center">
        <div className="flex flex-col self-center items-center m-8 lg:w-[920px] xl:w-[1080px]">
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <h2 className="text-2xl font-semibold">{course.courseCode.toUpperCase()}</h2>
            <p className="text-l mt-8">{course.description.replace(/(?<=(?:^|[.?!])\W*)[a-z]/g, i => i.toUpperCase())}</p>
            { reviewsInitialized && (
                <div className="border-[1px] border-slate-300 rounded-md w-[100%] min-h-[500px] p-8 mt-8">
                    <h3 className="text-2xl font-medium mb-8">Reviews</h3>
                    <div>
                        {reviews.map((review: Review) => (
                            <div className="bg-slate-400 rounded-md p-4 mb-4" key={review.id}>
                                <p className="mb-1 text-slate-800 font-semibold">{review.user.email}</p>
                                <p className="mb-1 text-slate-800">Rating: {review.rating}</p>
                                <p className="mb-1 text-slate-800">Comments: {review.comments}</p>
                                <p className="text-sm font-light text-slate-900 ">{review.timePosted}</p>
                            </div>
                        ))}
                    </div>
                    { user && (
                        <div className="mt-8 flex-col min-w-[300px]">
                            <form>
                                <h4 className="mb-2 text-lg">Already took the course? Post a review!</h4>
                                <select placeholder='rating' className="bg-gray-100 p-4 rounded-md mb-4 mr-4" value={rating} onChange={(evt: any) => setRating(evt.target.value as number)}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <label htmlFor="comments">Comments:</label>
                                <input type="text" id="comments" name="comments" onChange={(evt: any) => setComments(evt.target.value as string)}/>
                                <br></br>
                                <button 
                                    className="bg-blue-600 hover:bg-blue-700 rounded-md text-gray-50 p-4 active:scale-[98%]"
                                    onClick={PostReview}
                                >
                                    Post Review
                                </button>
                            </form>
                        </div>
                    )}
                    { !user && (
                        <div className="mt-8 flex-col min-w-[300px]">
                                <h4 className="mb-2 text-lg">Log in to post a review!</h4>
                        </div>
                    )}
                </div>
            ) }
        </div>
        </div>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext): GetServerSidePropsResult {
    const { code } = context.query
    console.log(code)
    
    const course: Course = await (new CourseService()).getCourse(code as string)
    // const reviews: Review[] = await (new ReviewService()).getCourseReviews(course.id)
    // console.log(reviews)

    return {
        props: {
            course,
            // reviews
        } 
    }
}