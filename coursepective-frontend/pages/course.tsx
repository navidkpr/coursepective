import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useState } from "react";


export default function CoursePage(props: { course: any }) {

    const [rating, setRating] = useState(undefined)

    const course = props.course

    function PostReview() {
        console.log(`Review posted with rating ${rating}`)
        const reviewInfo = {
            rating,
            timePosted: new Date()
        }
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
                    {course.reviews.map((review: any) => (
                        <div className="">
                            <p>{review.stars}</p>
                            <p>{review.timePosted}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex-col min-w-[300px]">
                    <h4 className="mb-2 text-lg">Already took the course? Post a review!</h4>
                    <select placeholder='rating' className="bg-gray-100 p-4 rounded-md mb-4 mr-4" value={rating} onChange={(event) => setRating(event.target.value)}>
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

const courses = [{
    courseCode: 'ECE496',
    name: 'Capstone Project',
    description: `This is the capstone course. ECE496Y is a full-year umbrella course for all fourth-year design projects. It is a requirement for all fourth-year electrical and computer engineering students, allowing them to integrate the knowledge acquired over the first three years of study in the planning and execution of project proposed either by the student or by a supervisor.


In this course, the students will develop skills that allow them to identify a problem given a brief description its context. Given that many real problems are solved by teams, it is essential that students learn how to work in teams and how to plan a project so that all team members become responsible for specific tasks.

Signup starts in the spring of the calendar year in which you will start the course. See "Almanac" under the Supervisors tab for a course overview. Projects can be chosen from the list or student-proposed. See the Projects tab for project information. Deadlines and process information are under the Students tab.`,
    id: "1",
    reviews: [{
        stars: 4,
        timePosted: new Date().toDateString()
    }]
}]

export function getServerSideProps(context: GetServerSidePropsContext): GetServerSidePropsResult {
    const { id } = context.query

    const course: any = courses.filter(course => course.id === id)[0]

    console.log(id)
    return {
        props: {
            course
        } 
    }
}