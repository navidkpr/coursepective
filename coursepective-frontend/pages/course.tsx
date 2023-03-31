import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useEffect, useState } from "react";
import CourseService, { Course } from "../services/course.service";
import ReviewService, { Review } from "../services/review.service";

import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';
import axios from "axios";
import FileService, { File } from "../services/file.service";
import { User } from "../services/users.service";
export default function CoursePage(props: { course: Course}) {

    const { user } = useUser();

    const course = props.course
    const [reviews, setReviews] = useState([] as Review[])
    const [files, setFiles] = useState([] as File[])
    const [rating, setRating] = useState(1)
    const [comments, setComments] = useState("")
    const [reviewsInitialized, setReviewsInitialized] = useState(false)
    const [filesInitialized, setFilesInitialized] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [fileError, setFileError] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [preChecked, setPreChecked] = useState(new Map)

    async function updateReviews() {
        console.log("in updateReviews")
        const reviewService = new ReviewService()
        const userEmail = user? user.email : undefined
        const fetchedReviews: Review[] = await reviewService.getCourseReviews(course.id, userEmail)
        const checked = alreadyUseful(fetchedReviews, userEmail)
        setReviews(fetchedReviews)
        setPreChecked(checked)
        setReviewsInitialized(true)
    }

    async function updateFiles() {
        const userEmail = user? user.email : undefined
        const fileService = new FileService()
        const fetchedFiles: File[] = await fileService.getCourseFiles(course.id, userEmail)
        setFiles(fetchedFiles)
        setFilesInitialized(true)
    }

    useEffect(() => {
        updateReviews()
        updateFiles()
    }, [user])

    async function postReview(e) {
        e.preventDefault();
        console.log("Posting review")
        if (!user) {
            return
        }
        const reviewService = new ReviewService()
        const alreadyPosted: boolean = await reviewService.checkIfReviewed(course.id, user.email)
        console.log(alreadyPosted)
        if(!alreadyPosted){
            await reviewService.postReview(course.id, rating, user.email, comments)
            updateReviews()
        }else{
            setReviewError("You have already posted a review for this course!")
        }
    }

    function alreadyUseful(reviewsMarkedUseful: Review[], user_email: string | null | undefined){
        let alreadyUsefulChecks = new Map() 
        reviewsMarkedUseful.forEach((review: Review) => {
            review.usefulVoters.forEach((voter: User) => {
                if (voter.email === user_email){
                    alreadyUsefulChecks.set(review.id, true)
                }
            })
        })
        return alreadyUsefulChecks

    }

    function preCheck(id: string){
        if (preChecked.get(id) === true){
            return true
        }
        else {
            return false
        }
    }

    async function onCheck(e: React.ChangeEvent<HTMLInputElement>, rID: string){
        if (!user) {
            return
        }
        const checked = e.target.checked
        const userEmail = user.email
        const reviewService = new ReviewService()
        await reviewService.putReviewUseful(rID, userEmail as string, checked)
        await updateReviews();
    }
    const uploadToClient = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setUploadedFile(file);
        }
    };

    const uploadToServer = async () => {
        setFileError("")
        if (!uploadedFile || !user || filename == "") {
            if (filename == "") {
                setFileError("File name is required.")
            }
            return;
        }

        const body = new FormData();
        body.append("file", uploadedFile);

        var config = {
            method: 'post',
            url: `http://localhost:8000/files/course/${course.id}/${user.email}/upload/${filename}`,
            headers: { 
                'Content-Type': 'multipart/form-data'
            },
            data : body
        };

        try {
            await axios(config);
        } catch (error) {
            setFileError("Could not upload your file. Please try again.")
        }
        updateFiles();
    };

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
                                <span className="label-text text-slate-800">{review.usefulVoters.length} found useful.</span>
                                <div className="">
                                    <label className="space-x-2 cursor-pointer">
                                        <span className="label-text text-slate-800 align-middle">Was this review useful?</span> 
                                        <input type="checkbox" className="checkbox checkbox-sm border-slate-800/50  align-middle" onChange={(evt) => {onCheck(evt, review.id)}} checked={preCheck(review.id)} />
                                    </label>
                                </div>
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
                                <br></br>
                                <label htmlFor="comments">Comments:</label>
                                <br></br>
                                <textarea rows={5} cols={100} maxLength={244} placeholder=" This course saved my life because..." id="comments" name="comments" onChange={(evt: any) => setComments(evt.target.value as string)}/>
                                <br></br>
                                <button 
                                    className="bg-blue-600 hover:bg-blue-700 rounded-md text-gray-50 p-4 active:scale-[98%]"
                                    onClick={postReview}
                                >
                                    Post Review
                                </button>
                                <p className="font-light text-xl text-red-200">{reviewError}</p>
                            </form>
                        </div>
                    )}
                    { !user && (
                        <div className="mt-8 flex-col min-w-[300px]">
                                <h4 className="mb-2 text-lg">Log in to post a review!</h4>
                        </div>
                    )}
                </div>
            )}
            { filesInitialized && (
                <div className="border-[1px] border-slate-300 rounded-md w-[100%] min-h-[500px] p-8 mt-8">
                    <h3 className="text-2xl font-medium mb-8">Related Files</h3>
                    <div>
                        {files.map((file: File) => (
                            <div className="bg-slate-400 rounded-md p-4 mb-4" key={file.id}>
                                <div className="flex justify-between">
                                {/* <p className="mb-1 text-slate-800 font-semibold">{file.user.email}</p> */}
                                    <div>
                                        <p>
                                            <span className="text-sm font-bold capitalize text-slate-900">{file.name}</span>
                                            <span className="text-sm font-light text-slate-900 ">{" by " + file.user.email}</span>
                                        </p>
                                        <p className="text-sm font-light text-slate-900">{file.timePosted}</p>
                                    </div>
                                    <a className="text-sm font-light cursor-pointer bg-blue-700 text-white p-4 rounded-sm" href={file.location} target="_blank">{"View File"}</a>
                                </div>
                            </div>
                        ))}
                    </div>
                    { user && (
                        <div className="mt-8 flex-col min-w-[300px]">
                                <h4 className="mb-2 text-lg">Already took this course? Upload related material!</h4>
                                <div className="flex flex-col gap-4">
                                    <input type="file" className="file-input file-input-bordered file-input-secondary w-full max-w-xs" onChange={uploadToClient} />
                                    <input 
                                        type="input" 
                                        className="input bg-blue-300 input-bordered w-full max-w-xs placeholder-slate-800 text-black" 
                                        onChange={(evt: any) => setFilename(evt.target.value as string)}
                                        value={filename}
                                        placeholder="File Name (Required)" 
                                    />
                                    <button 
                                        className="bg-blue-600 hover:bg-blue-700 rounded-md text-gray-50 p-4 active:scale-[98%]"
                                        onClick={uploadToServer}
                                        type="submit"
                                    >
                                        Upload File
                                    </button>
                                    <p className="font-light text-xl text-red-200">{fileError}</p>
                                </div>
                        </div>
                    )}
                    { !user && (
                        <div className="mt-8 flex-col min-w-[300px]">
                                <h4 className="mb-2 text-lg">Log in to upload course files!</h4>
                        </div>
                    )}
                </div>
            )}
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