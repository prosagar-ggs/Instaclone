import React,{useEffect,useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {UserContext} from "../../App"


const Profile = () =>{
    const navigate = useNavigate()
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image,setImage]= useState("")
    // console.log(state)
    useEffect(() =>{
        fetch('/mypost', {
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("jwt") 
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                setPics(result.mypost)
            }
            )
    },[])
    useEffect(() => {
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name", "dqwqgwzlh")
            fetch("https://api.cloudinary.com/v1_1/sagar325/image/upload", {
                method: "post",
                body: data
            })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                
                fetch('/updatepic', {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                }).then(res => res.json()) 
                    .then(result => {
                        // console.log(result)
                        localStorage.setItem("user", JSON.stringify({ ...state, pic: data.pic}))
                        dispatch({ type: "UPDATEPIC", payload: result.pic })
                    })
            }).catch(err => {
                console.log(err)
            })
        }
    },[image])

    const updatePic=(file)=>{
        setImage(file)
        
    }


    const deleteAccount=()=>{
        fetch('/delete-account', {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                localStorage.removeItem("jwt")
                localStorage.removeItem("user")
                dispatch({ type: "CLEAR" })
                navigate("/login")
            })
        }
    

    return(
        <div style={{ maxWidth: "800px", margin: "0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey",
                
            }}>
            <div >
                <div>
                    <img style={{ width: "200px", height: "200px", borderRadius: "100px" }}
                    src={state.pic}
                    />
                    
                </div>
                    <div className="file-field input-field" style={{ margin: "10px"}}>
                        <div className="btn #64b5f6 blue darken-1">
                            <span>Upload your Pic </span>
                            <input type="file"
                                onChange={(e) => updatePic(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
                        </div>
                    </div>
            </div>
                <div>

                    <h4>{state?state.name:"loading"}</h4>
                    <h5>{state ? state.email : "loading"}</h5>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?state.followers.length:"0"} followers</h6>
                        <h6>{state?state.following.length :"0"} following</h6>
                    </div>
                    <div style={{ margin: "80px 20px 0px 0px"}}>
                
                    <button className="btn waves-effect waves-light #43a047 red darken-5" 
                            onClick={() => deleteAccount()}
                    >Delete Account
                    </button>
                    
                    </div>
                
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Profile