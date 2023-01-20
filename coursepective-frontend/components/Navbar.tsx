import Link from 'next/link';
import router, { useRouter } from 'next/router';
import { useState } from 'react';

export interface headerProps extends React.ComponentPropsWithoutRef<'header'> { }

const Navbar: React.FC<headerProps> = ({ className, ...headerProps }) => {
    const router = useRouter()
    const [navSearchTerm, setNavSearchTerm] = useState(typeof(router.query.search) == "string"? router.query.search as string : "")

    return (
        <header
            {...headerProps}
        >
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <Link href='/' className="btn btn-ghost normal-case text-xl">Coursepective</Link>
                </div>
                <div className="flex-row gap-4">

                    <form className='flex flex-row gap-2' onSubmit={(evt) => {
                        evt.preventDefault()
                        router.push(`/results?search=${navSearchTerm}`);
                    }}>
                        <div className="form-control">
                            <input 
                                type="text" 
                                placeholder={"search"}
                                className="input input-bordered text-white"
                                value={navSearchTerm}
                                onChange={(evt) => {setNavSearchTerm(evt.target.value)}}
                            />
                        </div>
                        <button className='button p-4 bg-slate-800 hover:bg-slate-700 active:scale-[97.5%] rounded-sm'>
                            Search
                        </button>
                    </form>
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
                            <li><a href="/api/auth/login">Login</a></li>
                            <li><a href="/api/auth/logout">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;