import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { FriendRequest, default as FriendService } from '../services/friend.service';

export interface headerProps extends React.ComponentPropsWithoutRef<'header'> { }

const Navbar: React.FC<headerProps> = ({ className, ...headerProps }) => {

    const { user } = useUser();

    const router = useRouter()
    const [navSearchTerm, setNavSearchTerm] = useState(typeof(router.query.search) == "string"? router.query.search as string : "")
    
    const [addFriendInput, setAddFriendInput] = useState("")
    const [friendRequests, setFriendRequests] = useState([] as FriendRequest[]);

    async function updateFriendRequests() {
        if (user?.email) {
            const friendService = new FriendService()
            const fetchedFriendRequests: FriendRequest[] = await friendService.getFriendRequests(user.email)
            setFriendRequests(fetchedFriendRequests)
        }
    }

    useEffect(() => {
        updateFriendRequests()
    }, [user])

    function removeHandler(){
        let x = e.target.getAttribute()
    }

    async function sendFriendRequest() {
        if (user?.email) {
            const friendService = new FriendService();
            try {
                await friendService.sendFriendRequest(user.email, addFriendInput)
                setAddFriendInput('successfully sent')
            } catch(error) {
                console.log(error);
                setAddFriendInput('failed')
            }
        }
    }

    async function respondToFriendRequest(evt: any, friendRequest: FriendRequest, accepted: bool) {
        try {
            if (user?.email) {
                const friendService = new FriendService()
                await friendService.respondToFriendRequest(user.email, friendRequest.id, accepted)
                setFriendRequests(friendRequests.filter(req => req.id != friendRequest.id))
            }
        } catch (error) {
            console.log(error)
        }
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
                    <div className="dropdown dropdown-bottom dropdown-end">
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
                            <li className="bg-purple-700 flex flex-row items-center">
                                <div className='flex flex-row justify-between items-center hover:cursor-default align-center w-[100%]'>
                                    <input 
                                        placeholder='Email Address'
                                        className='p-4 border-none border-transparent focus:border-transparent focus:ring-0'
                                        value={addFriendInput}
                                        onChange={(evt) => {setAddFriendInput(evt.target.value)}}
                                    ></input>
                                    <button
                                        className='bg-slate-800 py-4 px-2'
                                        onClick={() => sendFriendRequest()}
                                    >
                                        Add Friend
                                    </button>
                                </div>
                            </li>
                            {friendRequests.map(friendRequest => (
                                <li className='bg-gray-700'>
                                    <div className='flex flex-row justify-between hover:cursor-default hover:bg-inherit'>
                                        {friendRequest.origin.email}
                                        <div className='flex flex-row justify-end'>
                                            <button 
                                                className='bg-green-700 p-2 mr-2 hover:bg-green-600 hover:scale-[98%] text-white hover:cursor-pointer'
                                                onClick={(evt) => {respondToFriendRequest(evt, friendRequest, true)}}>
                                                Accept
                                            </button>
                                            <button 
                                                className='bg-red-700 p-2 hover:bg-red-600 hover:scale-[98%] text-white hover:cursor-pointer'
                                                onClick={(evt) => {respondToFriendRequest(evt, friendRequest, false)}}>
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