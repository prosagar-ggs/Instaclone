import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from "../../App";
import { Link } from 'react-router-dom';

const SubscribedUserPosts = () =>{
    const [data,setData]=useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(()=>{
        fetch("/getsubpost",{
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                setData(result.posts)
            })
    },[])
    const likePost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const unlikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const makeComment = (text, postId) => {
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deleteComment = (postId, commentsId) => {
        fetch(`/deletecomment/${postId}/${commentsId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.filter(record => {
                    return record._id !== result._id
                })
                setData(newData)
            })
    }
    return(
        <div className='home'>
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}>
                            <img style={{width:"40px",height:"40px",borderRadius:"50%",marginTop:"10px"}} src={item?item.postedBy.pic:"undefined"} alt="" />
                                <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile" } style={{marginLeft:"10px"}}>
                                    {item.postedBy.name}
                                </Link>
                            </h5>
                        <div className="card-image">
                            <img src={item.photo}/>
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{color:"red"}}>favorite</i>
                            {item.likes.includes(state._id)
                            ? 
                                <i className="material-icons"
                                onClick={() => unlikePost(item._id)}
                                style={{color:"green", cursor:"pointer",marginLeft:"10px"}}
                                >thumb_down</i>
                            :   
                                <i className="material-icons"
                                onClick={() => likePost(item._id)}
                                style={{color:"green", cursor:"pointer",marginLeft:"10px"}}
                                >thumb_up</i>
                            }
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}
                                            {record.postedBy._id === state._id &&
                                                <i className="material-icons"
                                                style={{float: 'right',color:"red",padding:"5px 5px 0px 0px",cursor:"pointer"}}
                                                onClick={() => deleteComment(record._id)}
                                                >delete</i>
                                            }
                                            </h6>
                                        )
                                    }
                                    )
                            }
                            
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                <input type="text" placeholder="add comment" />
                            </form>
                        </div>
        </div>
                    )
                })
            }
            
        </div>
    )
}
export default SubscribedUserPosts