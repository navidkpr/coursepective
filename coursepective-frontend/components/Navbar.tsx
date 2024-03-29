import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FriendRequest, default as FriendService } from '../services/friend.service';
import UsersService, { User } from '../services/users.service';

export interface headerProps extends React.ComponentPropsWithoutRef<'header'> { }

const Navbar: React.FC<headerProps> = ({ className, ...headerProps }) => {

    const { user } = useUser();

    const router = useRouter()
    const [navSearchTerm, setNavSearchTerm] = useState(typeof(router.query.search) == "string"? router.query.search as string : "")
    
    const [backendUser, setBackendUser] = useState(null as User | null)
    const [addFriendInput, setAddFriendInput] = useState("")
    const [friendRequests, setFriendRequests] = useState([] as FriendRequest[]);

    async function updateFriendRequests() {
        if (user?.email) {
            const friendService = new FriendService()
            const fetchedFriendRequests: FriendRequest[] = await friendService.getFriendRequests(user.email)
            setFriendRequests(fetchedFriendRequests)
        }
    }

    async function updateUserFromBackend() {
        if (user) {
            const userService = new UsersService()
            setBackendUser(await userService.getUser(user.email))
        } else {
            setBackendUser(null)
        }
    }

    useEffect(() => {
        updateUserFromBackend()
        updateFriendRequests()
    }, [user])

    async function sendFriendRequest(e: any) {
        e.preventDefault();
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

    async function respondToFriendRequest(evt: any, friendRequest: FriendRequest, accepted: boolean) {
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
            <div className="navbar bg-base-100 mt-2 w-[100%]">
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
                    
                    { user && (
                        <div className="flex-auto">
                        <div className="dropdown dropdown-bottom dropdown-end">
                            <div>
                                { friendRequests.length > 0 && (
                                    <div className="indicator">
                                        <button tabIndex={0}>
                                            <span className="indicator-item badge bg-purple-700 text-gray-100">{friendRequests.length}</span> 
                                            <div className="grid h-12 place-items-center btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                            </svg>
                                            </div>
                                        </button>
                                    </div>
                                )}
                                { !friendRequests.length && (
                                    <div className="indicator">
                                        <button tabIndex={0}>
                                            <div className="grid h-12 place-items-center btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                            </svg>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content rounded-box bg-transparent">
                                <li className="bg-gray-800 flex flex-row items-center">
                                    <form className='flex flex-row items-center hover:cursor-default align-center hover:bg-inherit'>
                                        <input 
                                            placeholder='Email Address'
                                            className='input px-2 py-4 wx-20 rounded-md'
                                            value={addFriendInput}
                                            onChange={(evt) => {setAddFriendInput(evt.target.value)}}
                                        ></input>
                                        <button
                                            className='bg-slate-800 px-2 py-[6px] hover:bg-slate-900 rounded-md'
                                            onClick={(e) => sendFriendRequest(e)}
                                        >
                                            Add Friend
                                        </button>
                                    </form>
                                </li>
                                {friendRequests.map(friendRequest => (
                                    <li className='bg-gray-700'>
                                        <div className='flex flex-row justify-between hover:cursor-default hover:bg-inherit'>
                                            {friendRequest.origin.email}
                                            <div className='flex flex-row justify-end'>
                                                <button 
                                                    className='bg-green-700 p-2 mr-2 hover:bg-green-600 hover:scale-[98%] text-white hover:cursor-pointer rounded-md'
                                                    onClick={(evt) => {respondToFriendRequest(evt, friendRequest, true)}}>
                                                    Accept
                                                </button>
                                                <button 
                                                    className='bg-red-700 p-2 hover:bg-red-600 hover:scale-[98%] text-white hover:cursor-pointer rounded-md'
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
                    )}
                    { user && (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    { backendUser && 
                                        <img src={backendUser.profilePictureUrl} />
                                    }
                                </div>
                            </label>
                            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box">
                                <li>
                                    <a href={`/profile?email=${user.email}`}className="justify-between">
                                        Profile
                                    </a>
                                </li>
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