import { useUser } from '@auth0/nextjs-auth0/client';
import UsersService, { User } from "../services/users.service";
import ReviewService, { Review } from "../services/review.service";
import Link from 'next/link';
import {useState, useEffect} from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export default function Profile(props: { user: User}) {

    const profileUser = props.user
    const { user, error, isLoading } = useUser();
    const [friends, setFriends] = useState([] as User[])
    const [friendsInitialized, setFriendsInitialized] = useState(false)   
    const [reviews, setReviews] = useState([] as Review[])
    const [reviewsInitialized, setReviewsInitialized] = useState(false)
    const [usefulReviews, setUsefulReviews] = useState([] as Review[])
    const [usefulReviewsInitialized, setUsefulReviewsInitialized] = useState(false)
    const [areFriends, setAreFriends] = useState(false)
    const [areFriendsInitialized, setAreFriendsInitialized] = useState(false)



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

    return (
        <html>
        <body className="bg-gray-300 antialiased">
            <div className="container mx-0 my-60 w-[100%]">
                <div>
                    <div className="bg-white relative shadow rounded-lg w-5/6 md:w-5/6  lg:w-4/6 xl:w-3/6 mx-auto">
                        <div className="flex justify-center">
                                <img src="https://www.comm.utoronto.ca/frank/assets/images/FRK2018-600x600.jpg" alt={user.name} className="rounded-full mx-auto absolute -top-20 w-32 h-32 shadow-md border-4 border-white transition duration-200 transform hover:scale-110"/>
                        </div>
                        
                        <div className="mt-16">
                            <h1 className="font-bold text-center text-3xl text-gray-900">{profileUser.email}</h1>
                            {/* <p className="text-center text-sm text-gray-400 font-medium">{user.name}</p> */}

                            {/* <div className="w-full">
                                <h3 className="font-medium text-gray-900 text-left px-6">Recent reviews</h3>
                            </div> */}
                        </div>
                    </div>
                    <div>
                    {/* <button 
                        className="bg-blue-600 hover:bg-blue-700 rounded-md text-gray-50 p-4 active:scale-[98%]"
                        onClick={updateFriends}
                    >
                        View Friends
                    </button> */}
                    </div>
                    {friendsInitialized && (
                        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
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
                        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                            <input type="checkbox" />
                            <h3 className="collapse-title text-xl font-medium">Reviews</h3>
                            <div className="collapse-content">
                                {reviews.map((review: Review) => (
                                    <div className="bg-slate-400 rounded-md p-4 mb-4" key={review.id}>
                                    <Link href={`/course?code=${review.course.courseCode}`} className="btn btn-ghost normal-case text-xl">{review.course.courseCode} : {review.course.name}</Link>
                                    <p className="mb-1 text-slate-800">Rating: {review.rating}</p>
                                    <span className="label-text text-slate-800">{review.usefulVoters.length} found useful.</span>
                                    <p className="mb-1 text-slate-800">Comments: {review.comments}</p>
                                    <p className="text-sm font-light text-slate-900 ">{review.timePosted}</p>
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
                                    <p className="mb-1 text-slate-800">Rating: {review.rating}</p>
                                    <span className="label-text text-slate-800">{review.usefulVoters.length} found useful.</span>
                                    <p className="mb-1 text-slate-800">Comments: {review.comments}</p>
                                    <p className="text-sm font-light text-slate-900 ">{review.timePosted}</p>
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