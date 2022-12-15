import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from "../../App"
import {useParams} from "react-router-dom"

const UserProfile = () =>{
    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    // console.log(state)
    const {userId} = useParams()
    // console.log(userId)
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId) : true);
    useEffect(() =>{
        fetch(`/user/${userId}`, {
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("jwt") 
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                setProfile(result)

            }
            )
    },[])

    const followUser=()=>{
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userId
            })
        }).then(res => res.json())
            .then(data => {
                // console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
            })
    }
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        }).then(res => res.json())
            .then(data => {
                // console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))

                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)
            })
    }
    return(
        <>
            {userProfile ?
                <div style={{ maxWidth: "800px", margin: "0px auto"}}>
                <div style={{
                    display:"flex",
                    justifyContent: "space-around",
                    margin: "18px 0px",
                    borderBottom: "1px solid grey",
                    
                }}>
                    <div>
                        <img style={{ width: "200px", height: "200px", borderRadius: "100px" }}
                                src={userProfile.user.pic}
                        />
                    
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{userProfile.posts.length} posts</h6>
                            <h6>{userProfile.user.followers.length} followers</h6>
                            <h6>{userProfile.user.following.length} following</h6>
                        </div>
                        {showFollow ?
                        <button className="btn waves-effect waves-light #ef9a9a red lighten-3" style={{margin:"10px"}}
                            onClick={() => followUser()}
                            >Follow
                            </button>

                        :
                        <button className="btn waves-effect waves-light #b71c1c red darken-4" style={{ margin: "10px" }}
                            onClick={() => unfollowUser()}
                        >Unfollow
                        </button>
                        }
                        
                        
                    
                    </div> 
                </div>
                <div className="gallery">
                    {
                        userProfile.posts.map(item => {
                            return (
                                <img key={item._id} className="item" src={item.photo} alt={item.title} />
                            )
                        })
                    }
                </div>
            </div>
                
                
            : <h2>loading......</h2>}
            
        </>
    )
}
export default UserProfile