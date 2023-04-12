import moment from "moment";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from '../components/Layout';
import CourseService, { Course } from "../services/course.service";
import ReviewService, { Review } from "../services/review.service";
import course from "./course";


export default function ResultsPage(props: { courses: Course[] }) {
    const router = useRouter();

    const courses = props.courses
    let params = (new URL(window.document.location as any)).searchParams;
    let search = params.get("search");
    if (search == "fuck" || search == "no" || search == "bad doggy" || search == "family man" || search == "santa" || search == "loblaw" || search == "loblaws" || search == "bell pepper" || search == "league" || search == "league of legends" || search == "bell peppers" || search == "alcohol" || search == "ultimate" || search == "spike ball" || search == "spikeball" || search == "frank") {
        window.location.href = "https://www.youtube.com/shorts/DybqzN22QuA";
    }

    return (
        <>
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
                            <tr className="bg-slate-800 mb-2 p-4 hover:bg-slate-700 active:scale-[97.5%] cursor-pointer" key={course.courseCode} onClick={() => {
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
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext): GetServerSidePropsResult {
    const { search } = context.query
    
    let courses: Course[] = await (new CourseService()).searchForCourses(typeof(search) == "string"? search : "")
    courses = courses.filter(course => course.name)
    console.log(courses)

    return {
        props: {
            courses,
        } 
    }
}