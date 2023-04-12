import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useEffect, useState } from "react";
import CourseService, { Course } from "../services/course.service";
import ReviewService, { Review } from "../services/review.service";

import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';
import axios from "axios";
import FileService, { File } from "../services/file.service";
import { User } from "../services/users.service";

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';


export default function CoursePage(props: { course: Course}) {

    const { user } = useUser();

    const course = props.course
    const [reviews, setReviews] = useState([] as Review[])
    const [files, setFiles] = useState([] as File[])
    const [teachingRating, setTeachingRating] = useState(1)
    const [labRating, setLabRating] = useState(1)
    const [testRating, setTestRating] = useState(1)
    const [comments, setComments] = useState("")
    const [professor, setProfessor] = useState("")
    const [reviewsInitialized, setReviewsInitialized] = useState(false)
    const [filesInitialized, setFilesInitialized] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [fileError, setFileError] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [editReviewInitialized, setEditReviewInitialized] = useState(false)
    const [checked, setChecked] = useState(new Map)
    const [checkboxDisabled, setCheckboxDisabled] = useState(true)

    async function updateReviews() {
        
        const reviewService = new ReviewService()
        const userEmail = user? user.email : undefined
        const fetchedReviews: Review[] = await reviewService.getCourseReviews(course.id, userEmail)
        setReviews(fetchedReviews)
        setReviewsInitialized(true)
    }

    async function updateFiles() {
        const userEmail = user? user.email : undefined
        const fileService = new FileService()
        const fetchedFiles: File[] = await fileService.getCourseFiles(course.id, userEmail)
        setFiles(fetchedFiles)
        setFilesInitialized(true)
    }

    async function enterEditMode(editTeachingRating: number, editLabRating: number, editTestRating: number, editComments: string, editProfessor: string){
        setTeachingRating(editTeachingRating)
        setLabRating(editLabRating)
        setTestRating(editTestRating)
        setComments(editComments)
        setProfessor(editProfessor)
        setEditReviewInitialized(true)
    }

    async function editReview() {
        const reviewService = new ReviewService()
        const userEmail = user? user.email : undefined
        if(teachingRating == 0) setTeachingRating(1)
        await reviewService.editReview(course.id, teachingRating, labRating, testRating, professor, userEmail, comments)
        setEditReviewInitialized(false)
        updateReviews()
    }

    async function prepopulateUsefulReviews() {
        const userEmail = user? user.email : undefined
        const fetchedReviews: Review[] = reviews
        const checked_state = alreadyUseful(fetchedReviews, userEmail)
        setChecked(checked_state)
        if (user){
            setCheckboxDisabled(false)
        }
    }

    useEffect(() => {
        updateReviews()
        updateFiles()
    }, [user])

    useEffect(() => {
        prepopulateUsefulReviews()
    }, [reviews])

    

    async function postReview(e) {
        e.preventDefault();
        console.log("Posting review")
        if (!user) {
            return
        }
        const reviewService = new ReviewService()
        const alreadyPosted: boolean = await reviewService.getUserCourseReview(course.id, user.email)
        console.log(alreadyPosted)
        if(!alreadyPosted){
            await reviewService.postReview(course.id, teachingRating, labRating, testRating, professor, user.email, comments)
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
    
    async function onCheck(e: React.ChangeEvent<HTMLInputElement>, rID: string){
        if (!user) {
            return
        }
        setCheckboxDisabled(true)
        const checked_state = e.target.checked
        const userEmail = user.email
        const reviewService = new ReviewService()
        setChecked(new Map(checked.set(rID,checked_state)))
        await reviewService.putReviewUseful(rID, userEmail as string, checked_state)
        await updateReviews();
        setCheckboxDisabled(false)
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
            url: `/files/course/${course.id}/${user.email}/upload/${filename}`,
            headers: { 
                'Content-Type': 'multipart/form-data'
            },
            data : body
        };
        const fileService = new FileService()
        const resp = await fileService.uploadFile(config);

        if (resp === false){
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
                            <div className="bg-slate-400 text-slate-800 rounded-md p-4 mb-4 flex gap-4" key={review.id}>
                                <div className="flex flex-col justify-between">
                                    <div>
                                    <img src={review.user.profilePictureUrl} className="w-12 h-12 rounded-full object-cover"/>
                                    </div>
                                    <div className="w-12">
                                    {user && user.email === review.user.email && !editReviewInitialized && (
                                        <button 
                                        // className="btn-primary btn-md flex bg-blue-600 hover:bg-blue-700 align-right rounded-md text-gray-50 p-4 active:scale-[98%]"
                                        className="btn btn-primary btn-sm" 
                                        type="submit"
                                        onClick={() => enterEditMode(review.teachingRating, review.labRating, review.testRating, review.comments, review.professor)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    </div>
                                </div>
                                <div>
                                <p className="mb-1 font-semibold">{review.user.email}</p>
                                
                                {user && user.email === review.user.email && editReviewInitialized && (
                                    <div>
                                        <div>
                                            <div className="flex align-middle">
                                                <div>
                                                    <h5 className="mb-2 mr-1 text-md text-slate-800">Teaching Quality: </h5>
                                                </div>
                                                <div>
                                                    <select placeholder='teaching rating' className="select bg-primary select-sm mb-4 mr-4 text-slate-300" value={teachingRating} onChange={(evt: any) => setTeachingRating(evt.target.value as number)}>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <h5 className="mb-2 mr-1 text-md text-slate-800">Lab Difficulty: </h5>
                                                </div>
                                                <div>
                                                    <select placeholder='lab rating' className="select bg-primary select-sm mb-4 mr-4 text-slate-300" value={labRating} onChange={(evt: any) => setLabRating(evt.target.value as number)}>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <h5 className="mb-2 mr-1 text-md text-slate-800">Test Difficulty: </h5>
                                                </div>
                                                <div>
                                                    <select placeholder='test rating' className="select bg-primary select-sm mb-4 mr-4 text-slate-300" value={testRating} onChange={(evt: any) => setTestRating(evt.target.value as number)}>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="professor">Name of Professor: </label>
                                                <input 
                                                    type="input"
                                                    className="input input-primary input-bordered input-sm text-slate-300"
                                                    onChange={(evt: any) => setProfessor(evt.target.value as string)}
                                                    value={professor}
                                                />                                            
                                            </div>
                                            <br></br>
                                            <label htmlFor="comments">Comments:</label>
                                            <br></br>
                                            <textarea className="textarea textarea-primary textarea-bordered text-slate-300" rows={5} cols={100} maxLength={244} value={comments} id="comments" name="comments" onChange={(evt: any) => setComments(evt.target.value as string)}/>
                                            <br></br>
                                            <button 
                                                className="bg-blue-600 hover:bg-blue-700 rounded-md text-gray-50 p-4 active:scale-[98%]"
                                                onClick={editReview}
                                            >
                                                Update Review
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {(!editReviewInitialized || (editReviewInitialized && user && user.email != review.user.email)) && (
                                    <div>
                                        <p className="mb-1 text-slate-800">Professor: {review.professor}</p>
                                        <span className="label-text text-slate-800">{review.usefulVoters.length} found useful.</span>
                                        <div className="">
                                            <label className="space-x-2 cursor-pointer">
                                                <span className="label-text text-slate-800 align-middle">Useful?</span> 
                                                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm border-slate-800/50  align-middle" onChange={(evt) => {onCheck(evt, review.id)}} disabled={checkboxDisabled} checked={checked.get(review.id) === true} />
                                            </label>
                                        </div>
                                    </div>
                                )}
                                
                                </div>
                                
                                { (!user || user.email != review.user.email || !editReviewInitialized) && 
                                    <div className="flex flex-col flex-grow justify-between">
                                        <div className="grid grid-cols-3">
                                            <p className="mb-1 text-slate-800">Lab Difficulty: {review.labRating}</p>
                                            <p className="mb-1 text-slate-800">Test Difficulty: {review.testRating}</p>
                                            <p className="mb-1 text-slate-800">Teaching Quality: {review.teachingRating}</p>
                                        </div>
                                        <div className="flex p-4 text-lg bg-slate-600 rounded-md">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} className="mb-1 text-slate-300">{review.comments}</ReactMarkdown>
                                        </div>
                                        <div className="flex w-[100%] justify-end items-end">
                                            <p className="text-sm font-light text-slate-900 mr-4">Posted: {review.timePosted}</p>
                                            {review.timeEdited && (
                                                <p className="text-sm font-light text-slate-900 ">Edited: {review.timeEdited}</p>
                                            )}
                                        </div>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                    { user && (
                        <div className="mt-8 flex-col min-w-[300px]">
                            <form>
                                <h4 className="mb-2 text-lg">Already took the course? Post a review!</h4>
                                <div className="flex">
                                    <div>
                                        <h5 className="mb-2 mr-1 text-md">Teaching Quality: </h5>
                                    </div>
                                    <div>
                                        <select placeholder='teaching rating' className="select select-primary select-sm mb-4 mr-4" value={teachingRating} onChange={(evt: any) => setTeachingRating(evt.target.value as number)}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        </select>
                                    </div>
                                    <div>
                                        <h5 className="mb-2 mr-1 text-md">Lab Difficulty: </h5>
                                    </div>
                                    <div>
                                        <select placeholder='lab rating' className="select select-primary select-sm mb-4 mr-4" value={labRating} onChange={(evt: any) => setLabRating(evt.target.value as number)}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        </select>
                                    </div>
                                    <div>
                                        <h5 className="mb-2 mr-1 text-md">Test Difficulty: </h5>
                                    </div>
                                    <div>
                                        <select placeholder='test rating' className="select select-primary select-sm mb-4 mr-4" value={testRating} onChange={(evt: any) => setTestRating(evt.target.value as number)}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="professor">Name of Professor: </label>
                                    <input 
                                        type="input" 
                                        className="input input-primary input-bordered input-sm"
                                        onChange={(evt: any) => setProfessor(evt.target.value as string)}
                                        value={professor}
                                        placeholder="Professor X" 
                                    />                                            
                                </div>
                                <br></br>
                                <label htmlFor="comments">Comments:</label>
                                <br></br>
                                <textarea className="textarea textarea-primary textarea-bordered" rows={5} cols={100} maxLength={244} placeholder=" You have the power of Markdown and 244 characters: GO" id="comments" name="comments" onChange={(evt: any) => setComments(evt.target.value as string)}/>
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
                        {(files instanceof Array) && files.map((file: File) => (
                            <div className="bg-slate-400 rounded-md p-4 mb-4" key={file.id}>
                                <img src={file.user.profilePictureUrl} className="w-12 h-12 rounded-full object-cover"/>
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