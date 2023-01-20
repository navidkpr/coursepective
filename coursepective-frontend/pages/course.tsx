import moment from "moment";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useState } from "react";
import CourseService, { Course } from "../services/course.service";
import ReviewService, { Review } from "../services/review.service";


export default function CoursePage(props: { course: Course, reviews: Review[] }) {

    const course = props.course
    const [reviews, setReviews] = useState(props.reviews)
    const [rating, setRating] = useState(1)

    async function PostReview() {
        const reviewService = new ReviewService()
        await reviewService.postReview(course.id, rating)
        setReviews(await reviewService.getCourseReviews(course.id))
    }

    return (
        <div className="flex justify-center flex-col items-center">
        <div className="flex flex-col self-center items-center m-8 lg:w-[920px] xl:w-[1080px]">
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <h2 className="text-2xl font-semibold">{course.courseCode}</h2>
            <p className="text-l mt-8">{course.description}</p>
            <div className="border-[1px] border-slate-300 rounded-md w-[100%] min-h-[500px] p-8 mt-8">
                <h3 className="text-2xl font-medium mb-8">Reviews</h3>
                <div>
                    {reviews.map((review: Review) => (
                        <div className="bg-slate-200 rounded-md p-4 mb-4" key={review.id}>
                            <p className="mb-1">Rating: {review.rating}</p>
                            <p className="text-sm font-light text-gray-500">{review.timePosted}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex-col min-w-[300px]">
                    <h4 className="mb-2 text-lg">Already took the course? Post a review!</h4>
                    <select placeholder='rating' className="bg-gray-100 p-4 rounded-md mb-4 mr-4" value={rating} onChange={(evt: any) => setRating(evt.target.value as number)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 rounded-md text-gray-50 p-4 active:scale-[98%]"
                        onClick={PostReview}
                    >
                        Post Review
                    </button>
                </div>
            </div>
        </div>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext): GetServerSidePropsResult {
    const { id } = context.query

    const course: Course = await (new CourseService()).getCourse(id as string)
    const reviews: Review[] = await (new ReviewService()).getCourseReviews(id as string)
    
    return {
        props: {
            course,
            reviews
        } 
    }
}