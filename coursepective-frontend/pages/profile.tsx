import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';

export default function Profile() {

    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (!user) return <div><a href="/api/auth/login"> Please Log In By Clicking Here</a></div>
    if (error) return <div>{error.message}</div>;

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
                            <p className="text-center text-sm text-gray-400 font-medium">{user.name}</p>

                            {/* <div className="w-full">
                                <h3 className="font-medium text-gray-900 text-left px-6">Recent reviews</h3>
                            </div> */}
                        </div>
                    </div>

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