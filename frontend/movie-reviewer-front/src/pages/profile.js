import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import "./profile.css";
import halfstar from '../star-half-icon.svg'
import star from '../star-full-icon.svg'


const Profile = () => {
    const { id } = useParams();

    const [currentUser, setCurrentUser] = useState(null);
    const [user, setUser] = useState(null);
    const [icon, setIcon] = useState("https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg");
    const navigate = useNavigate();
    const [backdrop, setBackdrop] = useState("")
    const [isFollowed, setIsFollowed] = useState(false)

    const editClicked = () => {
        navigate("/edit/profile")
    }

    const follow = async () => {
        const followresposne = await apiClient.post("http://localhost:44354/follow",
            { "user": id })

        if (followresposne.data.status == "success") {
            window.location.reload()
        }
    }

    useEffect(() => {  
        console.log(id)

        async function checkFollowing() {
            const isFollowingResponse = await apiClient.post("http://localhost:44354/checkfollow",
                {"user": id })

            setIsFollowed(isFollowingResponse.data.isFollowing)
        }

        async function getCurrentUser() {
            const response = await apiClient.get("http://localhost:44354/getuser")

            setCurrentUser(response.data)

            
        
        
        }

        async function getUserProfile() {
            const response = await apiClient.post("http://localhost:44354/getotheruser",
            {
                "id": id
            }
            )

            if (response.data.status == "success") {
                setUser(response.data)

                if (response.data.favouriteactor) {
                    setIcon("https://image.tmdb.org/t/p/original/".concat(response.data.favouriteactor.profile_path))
                }

                if (response.data.favouritefilm) {
                    setBackdrop("https://image.tmdb.org/t/p/original/".concat(response.data.favouritefilm.backdrop_path))
                }

            
            } else {
                navigate("/")
            }


        }

        checkFollowing();
        getUserProfile();
        getCurrentUser();






    },[]);
    console.log(user)

    return (
        <div className="container">
            { currentUser && user &&
                <div style={{ backgroundImage: `url(${backdrop})`}} className="profile">
                    <div className="gridcontainer">
                    <div className="profilebacking"> </div>
                    <div className="profileicon"> <img src={icon}/>  </div>
                    
                    <div className="profilename"> 
                        <h1> {user.username} </h1>
                    </div>
                    <div className="editbutton">
                            {currentUser.user_id === user.user_id ?
                                <button onClick={editClicked}>Edit</button> :
                                <div>
                                { isFollowed ?
                                    <button onClick={follow}>Unfollow</button>:
                                    <button onClick={follow}>Follow</button>
                                }
                                </div>
                                
                            }
                    </div>
                    <div className="userpicks">
                        { user.favouritefilm &&
                        <a href={"../m/" + user.favouritefilm.id}>
                            <img src= {"https://image.tmdb.org/t/p/original/".concat(user.favouritefilm.poster_path)}/>
                            <h1> {user.username}'s pick:</h1>
                            <h2> {user.favouritefilm.title} </h2>
                            <p className="overview">{user.favouritefilm.overview}</p>
                        </a>}
                    </div>
            
                    <div className="userfilms">
                        <div className="header">
                         <span>Reviews / Ratings - <b>{user.reviews.length}</b></span>
                         <span> More </span>
                        </div>
                        <div className="userfilmsbody">
                        {
                        user.reviews.length > 0 ? (
                        user.reviews.slice(0, 5).map(review =>
                            <a href={"../m/" + review.id}>
                            <div style={{ backgroundImage: `url(${"https://image.tmdb.org/t/p/original/".concat(review.movie.poster_path)})`}} className="filmRating">
                                <div className="userfilmRating">
                                { new Array(Math.trunc(review.rating)).fill('').map((_, i) => i < review.rating? 
                                <img src={star} /> : <p/>)}

                                { new Array(Math.round(review.rating)-Math.trunc(review.rating)).fill('').map((_, i) => i < review.rating? 
                                <img src={halfstar} /> : <p/>)}
                                </div>
                            
                            </div>
                                
                            </a>     
                )): (
                    <h1>No reviews found.</h1>
                )}
                </div>
                </div>

                    <div className="following"> 
                        <div className="header">
                            <span>Following - <b>{user.following.length}</b></span>
                            <span> More </span>
                        </div>

                        <div className="followersbody">
                            {user.following.slice(0, 5).map(follower =>
                            <a href={"../u/" + follower.id}>
                                <div className="person">
                                            {
                                                follower.fav_actor ?
                                                    <img src={"https://image.tmdb.org/t/p/original/".concat(follower.fav_actor.profile_path)} />
                                                    :
                                                    <img src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" />
                                            }
                                    <span>{follower.username} </span>
                                </div>
                            </a>
                            )}
                        </div>
                        
                    </div>
                    <div className="followers">
                        <div className="header">
                            <span>Followers - <b>{user.followers.length}</b> </span>
                            <span> More </span>
                        </div>
                        <div className="followersbody">
                            {user.followers.slice(0, 5).map(follower =>
                            <a href={"../u/" + follower.id}>
                                <div className="person">
                                            {
                                                follower.fav_actor ?
                                                    <img src={"https://image.tmdb.org/t/p/original/".concat(follower.fav_actor.profile_path)} />
                                                    :
                                                    <img src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" />
                                            }
                                    <span>{follower.username} </span>
                                </div>
                            </a>
                            )}
                        </div>

                    </div>

                </div>
                </div>
            }
        </div>


    );
}



export default Profile;