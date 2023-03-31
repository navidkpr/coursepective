import { useUser } from '@auth0/nextjs-auth0/client';
import UsersService, { User } from "../services/users.service";
import ReviewService, { Review } from "../services/review.service";
import Link from 'next/link';
import {useState, useEffect} from 'react';

export default function Profile() {

    const { user, error, isLoading } = useUser();
    const [friends, setFriends] = useState([] as User[])
    const [friendsInitialized, setFriendsInitialized] = useState(false)   
    const [reviews, setReviews] = useState([] as Review[])
    const [reviewsInitialized, setReviewsInitialized] = useState(false)


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
        const userEmail = user? user.email : undefined
        const fetchedReviews: Review[] = await reviewService.getUsersReviews(userEmail)
        setReviews(fetchedReviews)
        setReviewsInitialized(true)
    }

    if(!friendsInitialized) {
        updateFriends()
    }

    if(!reviewsInitialized) {
        updateReviews()
    }

    return (
        <html>
        <body className="bg-gray-300 antialiased">
            <div className="container mx-0 my-60 w-[100%]">
                <div>
                    <div className="bg-white relative shadow rounded-lg w-5/6 md:w-5/6  lg:w-4/6 xl:w-3/6 mx-auto">
                        <div className="flex justify-center">
                                <img src={user.picture} alt={user.name} className="rounded-full mx-auto absolute -top-20 w-32 h-32 shadow-md border-4 border-white transition duration-200 transform hover:scale-110"/>
                        </div>
                        
                        <div className="mt-16">
                            <h1 className="font-bold text-center text-3xl text-gray-900">{user.name}</h1>
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
                        <div>
                        <h3 className="text-2xl font-medium mb-2">Friends</h3>
                        {friends.map((user: User) => (
                            <div className="bg-slate-400 rounded-md p-1 mb-1" key={user.email}>
                                <p className="mb-1 text-slate-800 font-semibold">{user.email}</p>
                            </div>
                        ))}
                        </div>
                    )}
                    {reviewsInitialized && (
                        <div>
                        <h3 className="text-2xl font-medium mb-2">Reviews</h3>
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
                    )}
                </div>
            </div>
        </body>
        </html>
        // <React.Fragment>
        //     <div classNameName="profile">
        //         <img 
        //             classNameName="photo"
        //             src={user.picture} 
        //             alt={user.name}
        //         />
        //         <table classNameName="info">
        //             <tbody>
        //                 <tr>
        //                     <td>Name:</td>
        //                     <td>{user.name}</td>
        //                 </tr>
        //             </tbody>
        //             <tbody>
        //                 <tr>
        //                     <td>Email:</td>
        //                     <td>{user.email}</td>
        //                 </tr>
        //             </tbody>
        //         </table>
        //     </div>
        //     <style>{`
        //         .profile {
        //             width: 100%;
        //             max-width: 350px;
        //             margin: 40px auto 0;
        //             padding: 15px;
        //             background-color: #fff;
        //             box-shadow: 0 2px 3px 0px rgba(0,0,0,0.2);
        //             border-radius: 5px;
        //         }
            
        //         .photo { border-radius: 100%; margin-top: -30px; }
        //         .title { margin-top: 0; }
                
        //         .info {
        //             width: 100%;
        //             margin: 0 0 10px;
        //             border-collapse: collapse;
        //             font-size: 14px;
        //             text-align: left;
        //         }
                
        //         .info tr:nth-child(odd) { background-color: #f5f5f5; } 
        //         .info tr td { padding: 6px; } 
                
        //         .info tr td:first-child {
        //             font-weight: 600;
        //             text-align: right;
        //         } 
        //     `}</style>
        // </React.Fragment>
    );
};