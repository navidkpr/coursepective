import moment from "moment";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import CourseService, { Course } from "../services/course.service";
import ReviewService, { Review } from "../services/review.service";
import course from "./course";


export default function ResultsPage(props: { courses: Course[] }) {
    const router = useRouter();

    const courses = props.courses

    return (
        <div className="flex justify-center flex-col items-center">
        <div className="flex flex-col self-center items-center m-8 lg:w-[920px] xl:w-[1080px]">
            {courses.map(course => (
                <div className="flex bg-slate-800 w-[100%] justify-center mb-2 p-4 hover:bg-slate-700 active:scale-[97.5%] cursor-pointer" onClick={() => {
                    router.push(`/course?code=${course.courseCode}`);
                }}>
                    {course.courseCode}
                    {course.name}
                </div>
            ))}
        </div>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext): GetServerSidePropsResult {
    const { search } = context.query

    const courses: Course[] = await (new CourseService()).searchForCourses(typeof(search) == "string"? search : "")
    
    return {
        props: {
            courses,
        } 
    }
}