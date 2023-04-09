import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReviewService, { Review } from "../services/review.service";
import UsersService, { User } from "../services/users.service";
import course from './course';

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

export default function Profile(props: { user: User}) {

    const profileUser = props.user
    const { user, error, isLoading } = useUser();
    const [friends, setFriends] = useState([] as User[])
    const [friendsInitialized, setFriendsInitialized] = useState(false)   
    const [reviews, setReviews] = useState([] as Review[])
    const [usefulReviews, setUsefulReviews] = useState([] as Review[])
    const [usefulReviewsInitialized, setUsefulReviewsInitialized] = useState(false)
    const [areFriends, setAreFriends] = useState(false)
    const [areFriendsInitialized, setAreFriendsInitialized] = useState(false)
    const [fileError, setFileError] = useState("");
    const [fileSuccess, setFileSuccess] = useState("");

    const [reviewsInitialized, setReviewsInitialized] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null);



    if (isLoading) return <div>Loading...</div>;
    if (!user) return <div><a href="/api/auth/login"> Please Log In By Clicking Here</a></div>
    if (error) return <div>{error.message}</div>;

    async function updateFriends() {
        console.log("in updateFriends")
        const usersService = new UsersService()
        const userEmail = user? user.email : undefined
        const fetchedFriends: User[] = await usersService.getFriends(userEmail)
        setFriends(fetchedFriends)
        setFriendsInitialized(true)
    }

    async function updateReviews() {
        console.log("in updateReviews")
        const reviewService = new ReviewService()
        const userEmail = profileUser.email
        const fetchedReviews: Review[] = await reviewService.getUsersReviews(userEmail)
        setReviews(fetchedReviews)
        setReviewsInitialized(true)
    }

    async function updateUsefulReviews() {
        console.log("in updateUsefulReviews")
        const reviewService = new ReviewService()
        const userEmail = profileUser.email
        const fetchedReviews: Review[] = await reviewService.getUsefulReviews(userEmail)
        setUsefulReviews(fetchedReviews)
        setUsefulReviewsInitialized(true)
    }

    async function checkIfFriends(){
        const usersService = new UsersService()
        const userEmail = user? user.email : undefined
        const areFriends = await usersService.areFriends(userEmail, profileUser.email)
        setAreFriends(areFriends)
        setAreFriendsInitialized(true)
    }

    if(!areFriendsInitialized && user && user.email != profileUser.email){
        checkIfFriends()
    }

    if(!friendsInitialized && user && user.email === profileUser.email) {
        updateFriends()
    }

    if(!reviewsInitialized) {
        if(user.email != profileUser.email){
            if(areFriendsInitialized && areFriends){
                updateReviews()
            }
        }else{
            updateReviews()
        }
    }

    if(!usefulReviewsInitialized) {
        updateUsefulReviews()
    }

    const uploadToClient = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setUploadedFile(file);
        }
    };

    const uploadToServer = async () => {
        setFileError("")
        setFileSuccess("")
        if (!uploadedFile || !user || user.email != profileUser.email) {
            return;
        }

        const body = new FormData();
        body.append("file", uploadedFile);

        var config = {
            method: 'post',
            url: `http://localhost:8000/users/${profileUser.email}/profile_picture`,
            headers: { 
                'Content-Type': 'multipart/form-data'
            },
            data : body
        };

        try {
            await axios(config);
            setFileSuccess("Profile picture successfully changed.")
        } catch (error) {
            setFileError("Could not upload your file. Please try again.")
        }
    };

    return (
        <html>
        <body className="bg-gray-300 antialiased">
            <div className="container mx-0 my-60 w-[100%] p-4">
                <div>
                    {(profileUser.email === user.email || areFriends) && 
                        <div className="bg-white relative shadow rounded-lg w-5/6 md:w-5/6  lg:w-4/6 xl:w-3/6 mx-auto">
                            <div className="flex justify-center">
                                    <img src={profileUser.profilePictureUrl} alt={user.name} className="rounded-full mx-auto object-cover absolute -top-20 w-32 h-32 shadow-md border-4 border-white transition duration-200 transform hover:scale-110"/>
                            </div>
                            
                            <div className="mt-16">
                                <h1 className="font-bold text-center text-3xl text-gray-900">{profileUser.email}</h1>
                                {/* <p className="text-center text-sm text-gray-400 font-medium">{user.name}</p> */}

                                {/* <div className="w-full">
                                    <h3 className="font-medium text-gray-900 text-left px-6">Recent reviews</h3>
                                </div> */}
                            </div>
                        </div>
                    }
                    <div>
                    {/* <button 
                        className="bg-blue-600 hover:bg-blue-700 rounded-md text-gray-50 p-4 active:scale-[98%]"
                        onClick={updateFriends}
                    >
                        View Friends
                    </button> */}
                    </div>
                    <div className="flex flex-col mb-4">
                        <div>
                            <p className='mr-4 text-slate-800'>Update profile picture</p>
                            <input type="file" className="file-input file-input-bordered file-input-secondary w-full max-w-xs mr-4" 
                            onChange={uploadToClient} 
                            />
                            <button 
                                className="bg-blue-600 hover:bg-blue-700 rounded-md text-gray-50 p-4 active:scale-[98%]"
                                onClick={uploadToServer}
                                type="submit"
                            >
                                Upload File
                            </button>
                        </div>
                        <p className="font-light text-xl text-red-700">{fileError}</p>
                        <p className="font-light text-xl text-green-700">{fileSuccess}</p>
                    </div>
                    {friendsInitialized && (
                        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4">
                            <input type="checkbox" />
                            <h3 className="collapse-title text-xl font-medium">Friends</h3>
                            <div className='collapse-content'>
                                {friends.map((user: User) => (
                                    <div className="bg-slate-400 rounded-md p-1 mb-1" key={user.email}>
                                        <a href={`/profile?email=${user.email}`} className="btn btn-ghost normal-case text-m">{user.email}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {reviewsInitialized && (
                        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4">
                            <input type="checkbox" />
                            <h3 className="collapse-title text-xl font-medium">Reviews</h3>
                            <div className="collapse-content">
                                {reviews.map((review: Review) => (
                                    <div className="bg-slate-400 rounded-md p-4 mb-4" key={review.id}>
                                    <Link href={`/course?code=${review.course.courseCode}`} className="btn btn-ghost normal-case text-xl">{review.course.courseCode} : {review.course.name}</Link>
                                    <p className="mb-1 text-slate-800">Teaching Quality: {review.teachingRating}</p>
                                    <p className="mb-1 text-slate-800">Professor: {review.professor}</p>
                                    <p className="mb-1 text-slate-800">Lab Difficulty: {review.labRating}</p>
                                    <p className="mb-1 text-slate-800">Test Difficulty: {review.testRating}</p>
                                    <span className="label-text text-slate-800">{review.usefulVoters.length} found useful.</span>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="mb-1 text-slate-800">{review.comments}</ReactMarkdown>
                                    <p className="text-sm font-light text-slate-900 ">Posted: {review.timePosted}</p>
                                    {review.timeEdited && (
                                        <p className="text-sm font-light text-slate-900 ">Edited: {review.timeEdited}</p>
                                    )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {usefulReviewsInitialized && (
                        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                            <input type="checkbox" />
                            <h3 className="collapse-title text-xl font-medium">Useful Reviews</h3>
                            <div className="collapse-content">
                                {usefulReviews.map((review: Review) => (
                                    <div className="bg-slate-400 rounded-md p-4 mb-4" key={review.id}>
                                    <Link href={`/course?code=${review.course.courseCode}`} className="btn btn-ghost normal-case text-xl">{review.course.courseCode} : {review.course.name}</Link>
                                    <p className="mb-1 text-slate-800"> {review.user.email}</p>
                                    <p className="mb-1 text-slate-800">Teaching Quality: {review.teachingRating}</p>
                                    <p className="mb-1 text-slate-800">Professor: {review.professor}</p>
                                    <p className="mb-1 text-slate-800">Lab Difficulty: {review.labRating}</p>
                                    <p className="mb-1 text-slate-800">Test Difficulty: {review.testRating}</p>                                    
                                    <span className="label-text text-slate-800">{review.usefulVoters.length} found useful.</span>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="mb-1 text-slate-800">{review.comments}</ReactMarkdown>
                                    <p className="text-sm font-light text-slate-900 ">Posted: {review.timePosted}</p>
                                    {review.timeEdited && (
                                        <p className="text-sm font-light text-slate-900 ">Edited: {review.timeEdited}</p>
                                    )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </body>
        </html>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext): GetServerSidePropsResult {
    const { email } = context.query
    console.log(email)
    
    const user: User = await (new UsersService()).getUser(email as string)

    return {
        props: {
            user,
        } 
    }
}