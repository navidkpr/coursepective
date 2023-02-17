import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import FriendService, { FriendRequest } from '../services/friend.service';

export interface headerProps extends React.ComponentPropsWithoutRef<'header'> { }

const Navbar: React.FC<headerProps> = ({ className, ...headerProps }) => {

    const { user } = useUser();

    const router = useRouter()
    const [navSearchTerm, setNavSearchTerm] = useState(typeof(router.query.search) == "string"? router.query.search as string : "")

    const [friendRequests, setFriendRequests] = useState([] as FriendRequest[]);

    useEffect(() => {
        // grab friend request from backend
        // const fetchedFriendrequests = await FriendService.getFriendRequests()
        // SetFriendRequests(fetchedFriendrequests)
        
        setFriendRequests([
            {
                "id": "1",
                "origin": {
                    "email": "navidkpour@gmail.com",
                    "id": "2"
                },
                "dest": {
                    "email": "natcojoe@gmail.com",
                    "id": "3"
                }
            },
            {
                "id": "1",
                "origin": {
                    "email": "rchinezon@gmail.com",
                    "id": ""
                },
                "dest": {
                    "email": "natcojoe@gmail.com",
                    "id": "3"
                }
            }
        ])
    })

    function removeHandler(){
        let x = e.target.getAttribute()
    }

    function acceptFriendRequest() {
        // FriendService.respondToFriendRequest(id, user, true)
    }

    
    return (
        <header
            {...headerProps}
        >
            <div className="navbar bg-base-100 mt-2">
                <div className="flex-1">
                    <Link href='/' className="btn btn-ghost normal-case text-xl">Coursepective</Link>
                </div>
                <div className="flex-row gap-4">
                    <form className='flex flex-row gap-2 items-center' onSubmit={(evt) => {
                        evt.preventDefault()
                        router.push(`/results?search=${navSearchTerm}`);
                    }}>
                        <div className="">
                            <input 
                                type="text" 
                                placeholder={"Looky"}
                                className="input input-bordered w-full max-w-xs"
                                value={navSearchTerm}
                                onChange={(evt) => {setNavSearchTerm(evt.target.value)}}
                            />
                        </div>
                        <button className='btn'>
                            Search
                        </button>
                    </form>
                    <div className="flex-auto">
                    <div className="dropdown dropdown-end">
                        <div>
                            { friendRequests.length && ( // With dot
                                <div className="indicator">
                                    <button tabIndex={0}>
                                        <span className="indicator-item badge bg-purple-700 text-gray-100 roudned-xl">{friendRequests.length}</span> 
                                        <div className="grid h-12 place-items-center btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            )}
                            { !friendRequests.length && ( // Without dot
                                <div className="indicator">
                                <button tabIndex={0}>
                                    <div className="grid h-12 place-items-center btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                            )}
                        </div>
                        <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content rounded-box w-52 bg-transparent">
                            {friendRequests.map(friendRequest => (
                                <li className='bg-gray-700 hover:roudned-lg'>
                                    <div className='flex flex-row justify-between hover:cursor-default hover:bg-inherit'>
                                        {friendRequest.origin.email}
                                        <div className='flex flex-row justify-end'>
                                            <button 
                                                className='bg-green-700 p-2 mr-2 hover:bg-green-600 hover:scale-[98%] text-white hover:cursor-pointer'
                                                onClick={(evt) => removeHandler}>
                                                Accept
                                            </button>
                                            <button 
                                                className='bg-red-700 p-2 hover:bg-red-600 hover:scale-[98%] text-white hover:cursor-pointer'
                                                onClick={(evt) => removeHandler}>
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    </div>
                    { user && (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img src="https://placeimg.com/80/80/people" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                                <li>
                                    <a href="/profile"className="justify-between">
                                        Profile
                                    </a>
                                </li>
                                <li><a>Settings</a></li>
                                { user && <li><a href="/api/auth/logout">Logout</a></li> }
                            </ul>
                        </div>
                    )}
                    { !user && (
                        <Link href="/api/auth/login" className='btn'>Login / Sign Up</Link> 
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;