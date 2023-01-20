import moment from "moment";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from '../components/Layout';
import CourseService, { Course } from "../services/course.service";
import ReviewService, { Review } from "../services/review.service";
import course from "./course";


export default function ResultsPage(props: { courses: Course[] }) {
    const router = useRouter();

    const courses = props.courses

    return (
        <Layout>
            <div className="flex justify-center flex-col items-center">
            <div className="flex flex-col self-center items-center m-8 lg:w-[920px] xl:w-[1080px]">
                <table className="w-[100%] mb-2 p-4 table-normal border-separate border-spacing-y-4 bg-slate-600">
                    <thead className="bg-slate-900">
                        <tr>
                            <th className="w-[20%]">Course Code</th>
                            <th>Course Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr className="bg-slate-800 mb-2 p-4 hover:bg-slate-700 active:scale-[97.5%] cursor-pointer" onClick={() => {
                                router.push(`/course?code=${course.courseCode}`);
                            }}>
                                <td>
                                    {course.courseCode.toUpperCase()}
                                </td>
                                <td>
                                    {course.name.replace(/\b[a-z](?=[a-z]{2})/g, i => i.toUpperCase())}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext): GetServerSidePropsResult {
    const { search } = context.query

    const courses: Course[] = await (new CourseService()).searchForCourses(typeof(search) == "string"? search : "")
    console.log(courses)
    
    return {
        props: {
            courses,
        } 
    }
}